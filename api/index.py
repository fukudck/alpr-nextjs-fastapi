import gc
from fastapi import FastAPI , File, UploadFile, HTTPException, BackgroundTasks, WebSocket, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import os
import shutil
import time
import uuid
import mysql.connector
from pydantic import BaseModel
import time
import cv2 as cv
import numpy as np
from ultralytics import YOLO
import paddle
from paddleocr import PaddleOCR
from ultralytics.utils.plotting import Annotator
import torch
from api.wpodnet.backend import Predictor
from api.wpodnet.model import WPODNet
from PIL import Image
import datetime
import re
import os
from aiortc import RTCPeerConnection, RTCSessionDescription, VideoStreamTrack
import av
import asyncio
from collections import deque
import imghdr
from PIL import Image
from typing import Dict



class RecognitionModel:
    def __init__(self, model_name):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.recognition_model = self.load_model(model_name)

    def load_model(self, model_name):
        model = YOLO(model_name)  #'yolov8m.pt'
        model.to(self.device)

        return model

    def predict(self, frame):
        return self.recognition_model.track(
            frame,
            persist=True,
            verbose=False,
            conf=0.5,
            classes=[2, 3, 5, 7]
        )
        # return self.recognition_model(frame, verbose=False, classes = (2,3,5,7))[0]
    def predict_without_track(self, frame):
        return self.recognition_model(frame, verbose=False, classes = (2,3,5,7))[0]

class WPODNET:
    def __init__(self, alpr_model_weights):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.wpodnet_model = self.load_model(alpr_model_weights)
        self.wpodnet_predictor = self.load_predictor(self.wpodnet_model)

    def load_model(self, alpr_model_weights):
        model = WPODNet()
        model.to(self.device)

        checkpoint = torch.load(alpr_model_weights)
        model.load_state_dict(checkpoint)

        return model

    def load_predictor(self, model):
        predictor = Predictor(model)

        return predictor

use_correct_rules = True #@param {type:"boolean"}

class POCR:
    def __init__(self):
        self.paddle_ocr = self.load_model()

    def load_model(self):
        use_gpu = paddle.device.is_compiled_with_cuda()
        model = PaddleOCR(use_angle_cls=False, lang="en", show_log=False, use_mp=not use_gpu, use_gpu=use_gpu)
        return model

    def preprocess(self, img):
        lab = cv.cvtColor(img, cv.COLOR_BGR2LAB)
        l_channel, a, b = cv.split(lab)
        clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l_channel)
        limg = cv.merge((cl, a, b))
        enhanced_img = cv.cvtColor(limg, cv.COLOR_LAB2BGR)

        return enhanced_img

    def num2char(self, num):
        map_num2char = {
            "0": "D",
            "1": "T",
            "2": "Z",
            "3": "B",
            "4": "A",
            "5": "S",
            "6": "G",
            "7": "T",
            "8": "B",
            "9": "P",
            "$": "S",
        }
        temp = ""
        for i in num:
            if i in map_num2char:
                temp += map_num2char[i]
            else:
                temp += i
        return temp

    def char2num(self, char):
        map_char2num = {
            "A": "4",
            "B": "8",
            "C": "0",
            "D": "0",
            "E": "6",
            "F": "5",
            "G": "6",
            "H": "4",
            "I": "1",
            "J": "1",
            "L": "4",
            "O": "0",
            "P": "6",
            "Q": "0",
            "R": "8",
            "S": "5",
            #'T':'1',
            "T": "7",
            "U": "0",
            "V": "0",
            "Y": "1",
            "Z": "2",
        }
        temp = ""
        for i in char:
            if i in map_char2num:
                temp += map_char2num[i]
            else:
                temp += i

        return temp

    def correct(self, text):
        if text[3] == "-":
            final = (
                self.char2num(text[:2])
                + self.num2char(text[2])
                + self.char2num(text[3:])
            )
            return final
        if text[4] == "-":
            final = (
                self.char2num(text[:2])
                + self.num2char(text[2])
                + text[3]
                + self.char2num(text[4:])
            )
            return final
        return -1

    def ocr(self, plate_img):
        results = self.paddle_ocr.ocr(plate_img, cls=False, det=True)
        # print(results)
        if results[0] != None:
            txts = [line[1][0] for line in results[0]]
            scores = [line[1][1] for line in results[0]]
            scores = np.mean(scores)

            if len(txts) == 2:
                text = "".join([i for i in txts[0]]).replace("-", "")
                text += "-"
                text += "".join([i for i in txts[1]])
            else:
                text = "".join([i for i in txts])

            text = re.sub(r"['\",\.\?:\!]", "", text)
            text = text.strip().upper()

            if use_correct_rules:
                if len(text) >= 7 and len(text) <= 10:
                    final = self.correct(text)
                    return final, scores
            else:
                return text, scores

        return -1, -1


class ALPRModel:
    def __init__(self, recognition_model_name, alpr_model_weights):
        self.recognition_model_name = recognition_model_name
        self.wpodnet = WPODNET(alpr_model_weights)
        self.wpodnet_model = self.wpodnet.wpodnet_model
        self.wpodnet_predictor = self.wpodnet.wpodnet_predictor
        self.recognition_model = RecognitionModel(self.recognition_model_name)
        self.paddle_ocr = POCR()

class ALPRModel_Image(ALPRModel):
    def __init__(self, recognition_model_name, alpr_model_weights):
        super().__init__(recognition_model_name, alpr_model_weights)
    def run(self, img_path, run_uuid):
        start_time = time.time()
        img = cv.imread(img_path)
        results = self.recognition_model.predict_without_track(img)
        all_texts = []
        save_path = f'public/task_results/{run_uuid}'
        order = 0

        os.makedirs(save_path, exist_ok=True)  # Tạo thư mục riêng theo UUID

        for r in results:
            result = r.boxes
            b = result.xyxy
            order += 1
            

            for i, loc in enumerate(b):
                object_name = r.names[int(result.cls[i])]
                x1, x2 = int(loc[0]), int(loc[2])
                y1, y2 = int(loc[1]), int(loc[3])

                # wpod-net
                frame_to_pil = Image.fromarray(img[y1:y2, x1:x2])
                lpr_frame_prediction = self.wpodnet_predictor.predict(frame_to_pil, scaling_ratio=1)
                frame_to_pil = np.asarray(frame_to_pil)

                # paddle ocr
                annotated_lp = lpr_frame_prediction.annotate()
                annotated_lp = np.asarray(annotated_lp)
                cv.imwrite(f'{save_path}/annotated_{order}.jpg', annotated_lp)

                warped_lp = lpr_frame_prediction.warp()
                warped_lp = np.asarray(warped_lp)
                cv.imwrite(f'{save_path}/warped_{order}.jpg', warped_lp)

                text, score = self.paddle_ocr.ocr(warped_lp)
                all_texts.append({ "order": order, "text": text, "score": score, "annotated_lp": f"/task_results/{run_uuid}/annotated_{order}.jpg", "warped_lp": f"/task_results/{run_uuid}/warped_{order}.jpg", "vehicle_type": object_name })
        
        end_time = time.time()
        elapsed_time = end_time - start_time
        save_image_task_result(run_uuid, all_texts)
        create_or_update_task(run_uuid, None, "image", "completed", img_path, elapsed_time)
        return {"uuid": run_uuid, "type": "image", "status": "completed", "results": all_texts}

class ALPRModel_Video(ALPRModel):
    def __init__(self, recognition_model_name, alpr_model_weights):
        super().__init__(recognition_model_name, alpr_model_weights)
    def run(self, video_path, n_skip_frame, task_uuid):

        # Khởi động bộ đếm giờ
        start_time = time.time()

        # Tải video và lấy thông tin video
        cap = cv.VideoCapture(video_path)
        self.frame_width = int(cap.get(3))
        self.frame_height = int(cap.get(4))
        fps = int(cap.get(5))
        size = (self.frame_width, self.frame_height)


        # Tạo thư mục và khởi tạo vị trí lưu video
        os.makedirs(f"public/task_results/{task_uuid}", exist_ok=True)
        output = cv.VideoWriter(f"public/task_results/{task_uuid}/{task_uuid}.mp4",
                                cv.VideoWriter_fourcc(*'mp4v'),
                                fps, size)
        
        # Khởi tạo biến lưu kết quả
        results = []

        # Khởi tạo biến lưu kết quả nhận diện của frame trước đó
        # (để vẽ lên frame hiện tại nếu frame hiện tại không phải là frame cần nhận diện)
        last_results = None

        # Đọc từng frame trong video
        while cap.isOpened():
            success, frame = cap.read()

            # Lấy số thứ tự frame hiện tại
            n_frame = int(cap.get(cv.CAP_PROP_POS_FRAMES))

            # Nếu không đọc được frame thì dừng vòng lặp
            if not success:
                break

            # Nếu frame hiện tại không phải là frame cần nhận diện thì vẽ kết quả nhận diện của frame trước đó lên frame hiện tại
            # và tiếp tục vòng lặp
            # Nếu frame hiện tại là frame cần nhận diện thì nhận diện và vẽ lên frame hiện tại
            if n_skip_frame > 0:
                if n_frame % n_skip_frame != 0:
                    if last_results is not None:
                        annotated_frame, plates = self.plot_boxes(last_results, frame, True, run_uuid=task_uuid)
                    else:
                        annotated_frame = frame
                    output.write(annotated_frame)
                    continue
            last_results = self.recognition_model.predict(frame)

            annotated_frame, plates = self.plot_boxes(last_results, frame, False, run_uuid=task_uuid)
            if plates:
                results.append({"timestamp": frame_index_to_timestamp(n_frame, fps),"frame_number": n_frame, "plates": plates})
            output.write(annotated_frame)

        
        cap.release()
        output.release()
        cv.destroyAllWindows()
        end_time = time.time()
        elapsed_time = end_time - start_time
        del self.recognition_model
        gc.collect()
        # Ghi lại kết quả vào db
        results = {"uuid": task_uuid, "type": "video", "status": "completed","process_time": elapsed_time, "results": results}
        save_task_results(task_uuid, results["results"])
        create_or_update_task(task_uuid, None, "video", "completed", f"/task_results/{task_uuid}/{task_uuid}.mp4", elapsed_time)
        
    def plot_boxes(self, results ,frame, isSkip, run_uuid):
        # Khởi tạo Annotator để vẽ lên frame
        annotator = Annotator(frame)

        # Khởi tạo danh sách lưu kết quả nhận diện biển số xe
        plates = []

        # Lặp qua từng kết quả nhận diện
        for r in results:
            result = r.boxes
            if result.id is None:
                continue
            for box in result:
                # Lấy thông tin của từng box(Object)
                cls_id = int(box.cls[0]) if box.cls is not None else -1
                conf = float(box.conf[0]) if box.conf is not None else -1.0
                xyxy = box.xyxy[0].tolist()
                track_id = int(box.id[0]) if hasattr(box, "id") and box.id is not None else -1
                object_name = r.names.get(cls_id, "unknown")

                # Lấy toạ độ của box để vẽ Annotator
                x1, y1, x2, y2 = map(int, xyxy)
                annotator.box_label((x1, y1, x2, y2), str(track_id), color=(0, 0, 255), txt_color=(255, 255, 255))

                # Kiểm tra frame có phải là frame cần bỏ qua không
                # Nếu là frame cần bỏ qua thì không nhận diện biển số xe và không cần trả về kết quả
                if not isSkip:  
                    vehicle_roi = frame[y1:y2, x1:x2]

                    # Kiểm tra nếu vùng cắt hợp lệ
                    if vehicle_roi.shape[0] > 0 and vehicle_roi.shape[1] > 0:

                        # Chuyển đổi vùng cắt thành ảnh PIL để nhận diện biển số xe
                        # và nhận diện biển số xe bằng wpodnet và paddleocr
                        vehicle_image = Image.fromarray(cv.cvtColor(vehicle_roi, cv.COLOR_BGR2RGB))
                        lpr_frame_prediction = self.wpodnet_predictor.predict(vehicle_image, scaling_ratio=1)

                        # Kiểm tra độ tin cậy của dự đoán
                        # Nếu độ tin cậy lớn hơn 0.5 thì nhận diện biển số xe
                        if lpr_frame_prediction.confidence > 0.5:
                            warped_lp = lpr_frame_prediction.warp()
                            warped_lp = np.asarray(warped_lp)
                            cv.imwrite(f'public/task_results/{run_uuid}/warped_{track_id}.jpg', warped_lp)
                            text, score = self.paddle_ocr.ocr(warped_lp)
                            plates.append({"vehicle_id": track_id, "text": text, "confidence": score, "vehicle_type": object_name, "plate_image": f'/task_results/{run_uuid}/warped_{track_id}.jpg'})
        
        return annotator.result(), plates

class ALPRModel_Stream(ALPRModel, VideoStreamTrack):
    kind = "video"

    def __init__(self, track, recognition_model_name, alpr_model_weights):
        VideoStreamTrack.__init__(self)
        ALPRModel.__init__(self, recognition_model_name, alpr_model_weights)
        self.track = track
        self.latest_frame = deque(maxlen=1)
        self.latest_result = None
        self.latest_annotated = None

        # Tạo 2 task async song song:
        asyncio.create_task(self.frame_collector())
        asyncio.create_task(self.process_frames())

    async def frame_collector(self):
        while True:
            frame = await self.track.recv()
            self.latest_frame.append(frame)

    async def process_frames(self):
        global latest_result
        while True:
            if self.latest_frame:
                frame = self.latest_frame[-1]  # Lấy frame mới nhất nhưng không pop
                img = frame.to_ndarray(format="bgr24")

                # Nhận dạng nặng nhưng chạy async riêng
                last_results = self.recognition_model.predict(img)
                annotated_frame, plates = self.plot_boxes(last_results, img, False)

                self.latest_result = plates
                self.latest_annotated = annotated_frame
                latest_result = {
                    "plates": plates,
                    "timestamp": time.time()
                }

            await asyncio.sleep(0.05)  # 20 FPS xử lý nhận dạng

    async def recv(self):
        while not self.latest_frame:
            await asyncio.sleep(0.001)

        frame = self.latest_frame[-1]  # hoặc pop() nếu muốn loại khỏi hàng đợi

        if self.latest_annotated is not None:
            output = self.latest_annotated
        else:
            # fallback nếu chưa xử lý kịp
            output = frame.to_ndarray(format="bgr24")

        new_frame = av.VideoFrame.from_ndarray(output, format="bgr24")
        new_frame.pts = frame.pts
        new_frame.time_base = frame.time_base
        return new_frame
    def plot_boxes(self, results ,frame, isSkip):
        # Khởi tạo Annotator để vẽ lên frame
        annotator = Annotator(frame)

        # Khởi tạo danh sách lưu kết quả nhận diện biển số xe
        plates = []

        # Lặp qua từng kết quả nhận diện
        for r in results:
            result = r.boxes
            if result.id is None:
                continue
            for box in result:
                # Lấy thông tin của từng box(Object)
                cls_id = int(box.cls[0]) if box.cls is not None else -1
                conf = float(box.conf[0]) if box.conf is not None else -1.0
                xyxy = box.xyxy[0].tolist()
                track_id = int(box.id[0]) if hasattr(box, "id") and box.id is not None else -1
                object_name = r.names.get(cls_id, "unknown")

                # Lấy toạ độ của box để vẽ Annotator
                x1, y1, x2, y2 = map(int, xyxy)
                annotator.box_label((x1, y1, x2, y2), str(track_id), color=(0, 0, 255), txt_color=(255, 255, 255))

                # Kiểm tra frame có phải là frame cần bỏ qua không
                # Nếu là frame cần bỏ qua thì không nhận diện biển số xe và không cần trả về kết quả
                if not isSkip:  
                    vehicle_roi = frame[y1:y2, x1:x2]

                    # Kiểm tra nếu vùng cắt hợp lệ
                    if vehicle_roi.shape[0] > 0 and vehicle_roi.shape[1] > 0:

                        # Chuyển đổi vùng cắt thành ảnh PIL để nhận diện biển số xe
                        # và nhận diện biển số xe bằng wpodnet và paddleocr
                        vehicle_image = Image.fromarray(cv.cvtColor(vehicle_roi, cv.COLOR_BGR2RGB))
                        lpr_frame_prediction = self.wpodnet_predictor.predict(vehicle_image, scaling_ratio=1)

                        # Kiểm tra độ tin cậy của dự đoán
                        # Nếu độ tin cậy lớn hơn 0.5 thì nhận diện biển số xe
                        if lpr_frame_prediction.confidence > 0.5:
                            warped_lp = lpr_frame_prediction.warp()
                            warped_lp = np.asarray(warped_lp)
                            text, score = self.paddle_ocr.ocr(warped_lp)
                            plates.append({"vehicle_id": track_id, "text": text, "confidence": score, "vehicle_type": object_name, "plate_image": "None"})
        
        return annotator.result(), plates

def is_image(file_path: str) -> bool:
    # Check using imghdr
    if imghdr.what(file_path):
        return True
    
    # Check using PIL (Pillow)
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except Exception:
        return False

def is_video(file_path: str) -> bool:
    cap = cv.VideoCapture(file_path)
    if cap.isOpened():
        cap.release()
        return True
    return False

def frame_index_to_timestamp(frame_index: int, fps: float) -> str:
    """
    Chuyển số thứ tự frame thành timestamp định dạng HH:MM:SS.sss
    
    Args:
        frame_index (int): Số thứ tự của frame (bắt đầu từ 0).
        fps (float): Số khung hình trên giây.
    
    Returns:
        str: Timestamp ở định dạng HH:MM:SS.sss
    """
    if fps <= 0:
        raise ValueError("FPS phải lớn hơn 0")
    if frame_index < 0:
        raise ValueError("Số thứ tự frame phải >= 0")
    
    # Tính số giây
    total_seconds = frame_index / fps
    
    # Chuyển đổi thành định dạng HH:MM:SS.sss
    timestamp = str(datetime.timedelta(seconds=total_seconds))
    
    # Định dạng lại để luôn có 3 chữ số phần nghìn giây
    if "." in timestamp:
        hh_mm_ss, ms = timestamp.split(".")
        timestamp = f"{hh_mm_ss}.{ms[:3].ljust(3, '0')}"
    else:
        timestamp += ".000"
    
    return timestamp

def create_or_update_task(task_id, user_id, task_type, status, source_url=None, process_time=None):
    cursor.execute("""
        INSERT INTO tasks (id, user_id, type, status, source_url, process_time)
        VALUES (%s, %s, %s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            process_time = VALUES(process_time)
    """, (task_id, user_id, task_type, status, source_url, process_time))
    db.commit()

def save_task_results(task_id: str, results: list):
    for result in results:
        timestamp = result.get("timestamp")
        frame_number = result.get("frame_number")

        # 1. Thêm vào task_results
        cursor.execute("""
            INSERT INTO task_results (task_id, frame_number, timestamp)
            VALUES (%s, %s, %s)
        """, (task_id, frame_number, timestamp))
        db.commit()

        result_id = cursor.lastrowid  # lấy id của dòng vừa thêm

        # 2. Thêm các plates vào detected_vehicles
        plates = result.get("plates", [])
        for plate in plates:
            cursor.execute("""
                INSERT INTO detected_vehicles (
                    result_id, vehicle_id, plate_text, confidence,
                    vehicle_type, plate_image_url
                ) VALUES (%s, %s, %s, %s, %s, %s)
            """, (
                result_id,
                plate.get("vehicle_id"),
                plate.get("text") if plate.get("text") != -1 else None,
                plate.get("confidence") if plate.get("confidence") != -1 else None,
                plate.get("vehicle_type"),
                plate.get("plate_image") if plate.get("plate_image") != "None" else None
            ))
        db.commit()

def save_image_task_result(task_id: str, results: list):
    # Tạo bản ghi task_result
    cursor.execute("""
        INSERT INTO task_results (task_id, frame_number, timestamp)
        VALUES (%s, %s, %s)
    """, (task_id, "0", "0"))  # timestamp cố định "0" cho ảnh
    db.commit()

    result_id = cursor.lastrowid  # Lấy id mới tạo
    # Lặp qua từng kết quả (mỗi ảnh)
    for item in results:
        order = item.get("order")
        text = item.get("text", -1)
        score = item.get("score", -1)
        annotated_lp = item.get("annotated_lp")
        warped_lp = item.get("warped_lp")
        vehicle_type = item.get("vehicle_type", "unknown")



        # Lưu vào detected_vehicles
        cursor.execute("""
            INSERT INTO detected_vehicles (
                result_id, vehicle_id, plate_text, confidence,
                vehicle_type, plate_image_url
            ) VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            result_id,
            order,  # tạm dùng order làm vehicle_id
            text if text != -1 else None,
            score if score != -1 else None,
            vehicle_type, 
            warped_lp or None
        ))
        db.commit()

def run_ALPRModel_Video(model_path, weights_path, video_path, n_skip_frame, task_uuid):
    alpr_video = ALPRModel_Video(model_path, weights_path)
    alpr_video.run(video_path, n_skip_frame, task_uuid)
    

model_path = "api/model/yolov8n.pt"  # Model nhận diện phương tiện
weights_path = "api/weights/wpodnet.pth"

# Khởi tạo mô hình nhận diện từ ảnh
alpr_image = ALPRModel_Image(model_path, weights_path)
UPLOAD_FOLDER = "public/uploads" 
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

active_streams: Dict[str, ALPRModel_Stream] = {}
latest_result = {}  # Global lưu kết quả nhận diện
websocket_clients = set()  # Danh sách client WebSocket đang kết nối

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

db = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    database="vehicle_detection"
)
cursor = db.cursor()





@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}


@app.post("/api/image_LPR")
async def start_image_task(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file part")
    task_uuid = str(uuid.uuid4())  # Tạo UUID mới
    file_ext = os.path.splitext(file.filename)[-1].lower()  # Lấy phần mở rộng
    file_name = f"{task_uuid}{file_ext}"  # Đặt tên file

    # Tạo thư mục riêng cho UUID
    task_folder = os.path.join(UPLOAD_FOLDER, task_uuid)
    os.makedirs(task_folder, exist_ok=True)  # Tạo thư mục nếu chưa có

    file_path = os.path.join(task_folder, file_name)  # Đường dẫn đầy đủ

    # Lưu file vào thư mục UUID
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Validate if the uploaded file is an image
    if not is_image(file_path):
        os.remove(file_path)  # Delete invalid file
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")
    create_or_update_task(task_uuid, None, "image", "processing", f"/uploads/{task_uuid}/{os.path.basename(file_path)}")
    text = alpr_image.run(file_path, task_uuid)
    return JSONResponse(content=text)

@app.post("/api/video_LPR")
async def start_video_task(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file part")
    task_uuid = str(uuid.uuid4())  # Tạo UUID mới
    file_ext = os.path.splitext(file.filename)[-1].lower()  # Lấy phần mở rộng
    file_name = f"{task_uuid}{file_ext}"  # Đặt tên file

    # Tạo thư mục riêng cho UUID
    task_folder = os.path.join(UPLOAD_FOLDER, task_uuid)
    os.makedirs(task_folder, exist_ok=True)  # Tạo thư mục nếu chưa có

    file_path = os.path.join(task_folder, file_name)  # Đường dẫn đầy đủ

    # Lưu file vào thư mục UUID
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Validate if the uploaded file is an image
    if not is_video(file_path):
        os.remove(file_path)  # Delete invalid file
        raise HTTPException(status_code=400, detail="Uploaded file is not a valid video")
    
    create_or_update_task(task_uuid, None, "video", "processing", f"/uploads/{task_uuid}/{os.path.basename(file_path)}")
    background_tasks.add_task(run_ALPRModel_Video, model_path , weights_path, file_path, 5, task_uuid)
    return {"task_id": task_uuid, "type": "video", "status": "processing"}

@app.get("/task-status/{task_id}")
async def get_task_status(task_id: str):
    # Lấy thông tin task
    cursor.execute("SELECT type, status, source_url, process_time FROM tasks WHERE id = %s", (task_id,))
    task_row = cursor.fetchone()
    
    if not task_row:
        return {"status": "not_found"}
    
    task_type, status, source_url, process_time = task_row

    # Lấy tất cả các frame result
    cursor.execute("""
        SELECT id, frame_number, timestamp
        FROM task_results
        WHERE task_id = %s
        ORDER BY frame_number
    """, (task_id,))
    result_rows = cursor.fetchall()

    results = []
    for result in result_rows:
        result_id, frame_number, timestamp = result

        # Lấy tất cả plates trong từng frame
        cursor.execute("""
            SELECT vehicle_id, plate_text, confidence, vehicle_type, plate_image_url, is_blacklisted
            FROM detected_vehicles
            WHERE result_id = %s
        """, (result_id,))
        plate_rows = cursor.fetchall()

        plates = []
        for plate in plate_rows:
            vehicle_id, text, confidence, vehicle_type, plate_image, is_blacklisted = plate
            plates.append({
                "vehicle_id": vehicle_id,
                "text": text if text is not None else -1,
                "confidence": confidence if confidence is not None else -1,
                "vehicle_type": vehicle_type,
                "plate_image": plate_image if plate_image else "None",
                "is_blacklisted": is_blacklisted
            })

        results.append({
            "timestamp": timestamp,
            "frame_number": frame_number,
            "plates": plates
        })

    return {
        "uuid": task_id,
        "type": task_type,
        "status": status,
        "process_time": process_time,
        "source_url": source_url,
        "results": results
        
    }

@app.post("/api/stream_offer")
async def offer(request: Request):
    data = await request.json()
    session_id = data["session_id"]  # ví dụ: "ea94fd12-b9e2..."

    offer = RTCSessionDescription(sdp=data["sdp"], type=data["type"])
    pc = RTCPeerConnection()

    @pc.on("track")
    def on_track(track):
        if track.kind == "video":
            model_stream = ALPRModel_Stream(
                track,
                recognition_model_name=model_path,
                alpr_model_weights=weights_path
            )
            active_streams[session_id] = model_stream
            pc.addTrack(model_stream)

    await pc.setRemoteDescription(offer)
    answer = await pc.createAnswer()
    await pc.setLocalDescription(answer)

    return JSONResponse({
        "sdp": pc.localDescription.sdp,
        "type": pc.localDescription.type
    })

# WebSocket truyền kết quả JSON liên tục
@app.websocket("/api/stream_ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    websocket_clients.add(websocket)
    try:
        while True:
            await asyncio.sleep(1)
            if latest_result:
                await websocket.send_json(latest_result)
    except:
        pass
    finally:
        websocket_clients.discard(websocket)

# Mount frontend
app.mount("/stream_test", StaticFiles(directory="api/frontend", html=True), name="frontend")

print(f"Torch GPU CUDA available: {torch.cuda.is_available()}")
gpu_available  = paddle.device.is_compiled_with_cuda()
print("GPU available:", gpu_available)

# import sys
# import traceback

# class SpyOutput:
#     def write(self, msg):
#         if msg.strip() == "6":
#             print("6 Here:", file=sys.__stderr__)
#             traceback.print_stack(file=sys.__stderr__)
#         sys.__stdout__.write(msg)
#     def flush(self):
#         sys.__stdout__.flush()

# sys.stdout = SpyOutput()