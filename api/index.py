import gc
from fastapi import FastAPI , File, UploadFile, HTTPException, BackgroundTasks
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
from paddleocr import PaddleOCR
from ultralytics.utils.plotting import Annotator
import torch
from api.wpodnet.backend import Predictor
from api.wpodnet.model import WPODNet
from PIL import Image
import datetime
import re
import os

import imghdr
from PIL import Image

class RecognitionModel:
    def __init__(self, model_name):
        self.device = "cpu"
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
            conf=0.6,
            imgsz=640,
            classes=[2, 3, 5, 7],
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
        model = PaddleOCR(use_angle_cls=False, lang="en", show_log=False, use_mp=True)

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

class ALPRModel_Image(ALPRModel):
    def __init__(self, recognition_model_name, alpr_model_weights):
        super().__init__(recognition_model_name, alpr_model_weights)
        self.recognition_model = RecognitionModel(self.recognition_model_name)
        self.paddle_ocr = POCR()
    def run(self, img_path, run_uuid):
        img = cv.imread(img_path)
        results = self.recognition_model.predict_without_track(img)
        all_texts = []
        save_path = f'task_results/{run_uuid}'
        order = 0

        os.makedirs(save_path, exist_ok=True)  # Tạo thư mục riêng theo UUID

        for r in results:
            result = r.boxes.cpu()
            b = result.xyxy
            order += 1

            for i, loc in enumerate(b):
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
                all_texts.append({ "order": order, "text": text, "score": score, "annotated_lp": f"{save_path}/annotated_{order}.jpg", "warped_lp": f"{save_path}/warped_{order}.jpg" })
        save_image_task_result(run_uuid, all_texts)
        create_or_update_task(run_uuid, None, "image", "completed", img_path, None)
        return {"uuid": run_uuid, "type": "image", "status": "completed", "results": all_texts}

class ALPRModel_Video(ALPRModel):
    def __init__(self, recognition_model_name, alpr_model_weights):
        super().__init__(recognition_model_name, alpr_model_weights)
        self.recognition_model = RecognitionModel(self.recognition_model_name)
        self.paddle_ocr = POCR()
    def run(self, video_path, n_skip_frame, task_uuid):
        start_time = time.time()
        cap = cv.VideoCapture(video_path)
        self.frame_width = int(cap.get(3))
        self.frame_height = int(cap.get(4))
        fps = int(cap.get(5))
        size = (self.frame_width, self.frame_height)
        os.makedirs(f"task_results/{task_uuid}", exist_ok=True)
        output = cv.VideoWriter(f"task_results/{task_uuid}/{task_uuid}.mp4",
                                cv.VideoWriter_fourcc(*'mp4v'),
                                fps, size)
        results = []
        last_results = None

        while cap.isOpened():
            success, frame = cap.read()
            n_frame = int(cap.get(cv.CAP_PROP_POS_FRAMES))
            if not success:
                break
            if n_frame % n_skip_frame != 0:
                if last_results is not None:
                    annotated_frame, plates = self.plot_boxes(last_results, frame, True)
                else:
                    annotated_frame = frame
                output.write(annotated_frame)
                continue
            last_results = self.recognition_model.predict(frame)

            annotated_frame, plates = self.plot_boxes(last_results, frame, False)
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
        results = {"uuid": task_uuid, "type": "video", "status": "completed","process_time": elapsed_time, "results": results}
        save_task_results(task_uuid, results["results"])
        create_or_update_task(task_uuid, None, "video", "completed", video_path, elapsed_time)
        
    def plot_boxes(self, results ,frame, isSkip):
        annotator = Annotator(frame)
        plates = []
        for r in results:
            result = r.boxes.cpu()
            if result.id is None:
                continue
                
            objects_id = result.id
            target_objects = ['car', 'motorcycle', 'bus', 'truck']
            location_idx = []
            for tar in target_objects:
                temp_id = list(r.names.keys())[list(r.names.values()).index(tar)]
                temp_check = np.where(result.cls == temp_id)
                if len(temp_check[0]) > 0:
                    for temp in temp_check[0]:
                        location_idx.append((temp,tar))

            for i,vehicle in location_idx:
                b = result.xyxy[i]
                object_id = int(objects_id[i].item())
                x1, y1, x2, y2 = map(int, b)
                annotator.box_label((x1, y1, x2, y2), str(object_id), color=(0, 0, 255), txt_color=(255, 255, 255))

                if not isSkip:
                    vehicle_roi = frame[y1:y2, x1:x2]
                    # Kiểm tra nếu vùng cắt hợp lệ
                    if vehicle_roi.shape[0] > 0 and vehicle_roi.shape[1] > 0:
                        vehicle_image = Image.fromarray(cv.cvtColor(vehicle_roi, cv.COLOR_BGR2RGB))
                        lpr_frame_prediction = self.wpodnet_predictor.predict(vehicle_image, scaling_ratio=1)
                        if lpr_frame_prediction.confidence > 0.5:
                            warped_lp = lpr_frame_prediction.warp()
                            warped_lp = np.asarray(warped_lp)
                            text, score = self.paddle_ocr.ocr(warped_lp)
                            plates.append({"vehicle_id": object_id, "text": text, "confidence": score, "vehicle_type": vehicle, "plate_image": "None"})
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
            "unknown",  # không có trường vehicle_type → gán mặc định
            warped_lp or None
        ))
        db.commit()

def run_ALPRModel_Video(model_path, weights_path, video_path, n_skip_frame, task_uuid):
    alpr_video = ALPRModel_Video(model_path, weights_path)
    alpr_video.run(video_path, n_skip_frame, task_uuid)
    

model_path = "api/model/yolov8n.pt"  # Model nhận diện phương tiện
img_path = 'docs/sample/original/3.jpg'
weights_path = "api/weights/wpodnet.pth"
UPLOAD_FOLDER = "uploads" 

alpr_image = ALPRModel_Image(model_path, weights_path)

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

db = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    database="vehicle_detection"
)
cursor = db.cursor()





os.makedirs(UPLOAD_FOLDER, exist_ok=True)

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
    create_or_update_task(task_uuid, None, "image", "processing", file_path)
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
    
    create_or_update_task(task_uuid, None, "video", "processing", file_path)
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
            SELECT vehicle_id, plate_text, confidence, vehicle_type, plate_image_url
            FROM detected_vehicles
            WHERE result_id = %s
        """, (result_id,))
        plate_rows = cursor.fetchall()

        plates = []
        for plate in plate_rows:
            vehicle_id, text, confidence, vehicle_type, plate_image = plate
            plates.append({
                "vehicle_id": vehicle_id,
                "text": text if text is not None else -1,
                "confidence": confidence if confidence is not None else -1,
                "vehicle_type": vehicle_type,
                "plate_image": plate_image if plate_image else "None"
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
        "results": results
    }
