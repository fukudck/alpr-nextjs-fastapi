from fastapi import FastAPI , File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import shutil

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

import re
import os

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
    self.device = 'cuda' if torch.cuda.is_available() else 'cpu'
    self.wpodnet_model = self.load_model(alpr_model_weights)
    self.wpodnet_predictor = self.load_predictor(self.wpodnet_model)

  def load_model(self,alpr_model_weights):
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

class ALPR:
    def __init__(self, recognition_model_name, alpr_model_weights ):
        self.recognition_model = RecognitionModel(recognition_model_name)
        self.wpodnet = WPODNET(alpr_model_weights)
        self.wpodnet_model = self.wpodnet.wpodnet_model
        self.wpodnet_predictor = self.wpodnet.wpodnet_predictor
        self.paddle_ocr = POCR()
        self.paused =False
    def run_img(self, img_path):
        img = cv.imread(img_path)
        results = self.recognition_model.predict_without_track(img)

        all_texts = []  # Danh sách lưu kết quả OCR
        
        for r in results:
            result = r.boxes.cpu()
            b = result.xyxy

            for i, loc in enumerate(b):
                x1, x2 = int(loc[0]), int(loc[2])
                y1, y2 = int(loc[1]), int(loc[3])

                # wpod-net
                frame_to_pil = Image.fromarray(img[y1:y2, x1:x2])
                lpr_frame_prediction = self.wpodnet_predictor.predict(frame_to_pil, scaling_ratio=1)
                frame_to_pil = np.asarray(frame_to_pil)
                # DDeos bt cc gi het
                # cv.imwrite(f'content/{i}.jpg', frame_to_pil)

                # bounds
                # bound_xy1, bound_xy2, bound_xy3, bound_xy4 = lpr_frame_prediction.bounds.tolist()
                # min_x = min(bound_xy1[0], bound_xy2[0], bound_xy3[0], bound_xy4[0])
                # max_x = max(bound_xy1[0], bound_xy2[0], bound_xy3[0], bound_xy4[0])
                # min_y = min(bound_xy1[1], bound_xy2[1], bound_xy3[1], bound_xy4[1])
                # max_y = max(bound_xy1[1], bound_xy2[1], bound_xy3[1], bound_xy4[1])
                # img_bounds = image[min_y+y1:max_y+y1, min_x+x1:max_x+x1]
                # cv.imwrite(f'/content/bounds_{i}.jpg',img_bounds)

                # paddle ocr
                annotated_lp = lpr_frame_prediction.annotate()
                annotated_lp = np.asarray(annotated_lp)
                # cv.imwrite(f'content/annotated_{i}.jpg', annotated_lp)

                warped_lp = lpr_frame_prediction.warp()
                warped_lp = np.asarray(warped_lp)
                # cv.imwrite(f'content/warped_{i}.jpg', warped_lp)
                # warped_lp = paddle_ocr.preprocess(warped_lp)
                # warped_lp = paddle_ocr.preprocess(img_bounds)

                text, score = self.paddle_ocr.ocr(warped_lp)
                all_texts.append({"text": text, "score": score})
        return all_texts 

    def plot_boxes(self, results ,frame, isSkip):
        annotator = Annotator(frame)
        for r in results:
            result = r.boxes.cpu()
            if result.id is None:
                continue

            objects_id = result.id
            for i in range(len(result.xyxy)):
                b = result.xyxy[i]
                object_id = int(objects_id[i].item())
                x1, y1, x2, y2 = map(int, b)
                annotator.box_label((x1, y1, x2, y2), str(object_id), color=(0, 0, 255), txt_color=(255, 255, 255))

                #POCR
                if not isSkip:
                    vehicle_roi = frame[y1:y2, x1:x2]

                    # Kiểm tra nếu vùng cắt hợp lệ
                    if vehicle_roi.shape[0] > 0 and vehicle_roi.shape[1] > 0:
                        vehicle_image = Image.fromarray(cv.cvtColor(vehicle_roi, cv.COLOR_BGR2RGB))
                        lpr_frame_prediction = self.wpodnet_predictor.predict(vehicle_image, scaling_ratio=1)
                        if lpr_frame_prediction.confidence > 0.8:
                            warped_lp = lpr_frame_prediction.warp()
                            warped_lp = np.asarray(warped_lp)
                            text, score = self.paddle_ocr.ocr(warped_lp)
                            text = f"{object_id}, {text}{score}"
                            print(text)

        return annotator.result()

    def cv_show(self, frame, output):
        output.write(frame)
        scale_percent = 100  # Giảm kích thước xuống 50%
        width = int(frame.shape[1] * scale_percent / 100)
        height = int(frame.shape[0] * scale_percent / 100)
        resized_frame = cv.resize(frame, (width, height))

        cv.imshow("ALPR Detection", resized_frame)

    def run_video(self, video_path, output_path, n_skip_frame):
        start_time = time.time()
        cap = cv.VideoCapture(video_path)
        self.frame_width = int(cap.get(3))
        self.frame_height = int(cap.get(4))
        fps = int(cap.get(5))
        size = (self.frame_width, self.frame_height)
        output = cv.VideoWriter(output_path+"output.mp4",
                                cv.VideoWriter_fourcc(*'mp4v'),
                                fps, size)
        n_frame = 0
        last_results = None  # Lưu kết quả nhận diện của frame trước


        while cap.isOpened():
            if not self.paused:
                success, frame = cap.read()
                n_frame += 1
                if not success:
                    break
                if n_frame % n_skip_frame != 0:
                    if last_results is not None:
                        annotated_frame = self.plot_boxes(last_results, frame, True)
                    else:
                        annotated_frame = frame
                    # print(f'Skip frame {n_frame}')
                    self.cv_show(annotated_frame, output)
                    continue
                last_results = self.recognition_model.predict(frame)

                annotated_frame = self.plot_boxes(last_results, frame, False)
                self.cv_show(annotated_frame, output)

            key = cv.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('p'):
                self.paused = not self.paused
        cap.release()
        cv.destroyAllWindows()
        end_time = time.time()
        elapsed_time = end_time - start_time
        print("elapsed_time:{0}".format(elapsed_time) + "[sec]")


model_path = "api/model/yolov8n.pt"  # Model nhận diện phương tiện
img_path = 'docs/sample/original/3.jpg'
weights_path = "api/weights/wpodnet.pth"

alpr = ALPR(model_path, weights_path)

### Create FastAPI instance with custom docs and openapi url
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
UPLOAD_FOLDER = "uploads" 
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}

@app.post("/api/image_LPR")
async def upload_file(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file part")
    
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    text = alpr.run_img(file_path)
    return JSONResponse(content=text)