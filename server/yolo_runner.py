# server/yolo_runner.py
import sys, json, cv2, ffmpeg, math, tempfile, os
from tqdm import tqdm
from ultralytics import YOLO

"""
Usage: python yolo_runner.py <input_video> <output_json> <task_id>
Выводит в stdout строки 'PROGRESS: n' (n=0..100)
"""

INPUT  = sys.argv[1]
OUTPUT = sys.argv[2]

model = YOLO('yolov8s.pt')
cap = cv2.VideoCapture(INPUT)
if not cap.isOpened():
    print("OPEN_ERR", flush=True)
    sys.exit(1)

fps   = cap.get(cv2.CAP_PROP_FPS) or 25
frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
seconds = math.ceil(frame_count / fps)
counts_per_sec = [0] * seconds

for idx in tqdm(range(frame_count), ncols=70):
    ret, frame = cap.read()
    if not ret:
        break
    preds = model(frame, imgsz=640, conf=0.25, classes=[17], verbose=False)[0]
    horse_count = len(preds.boxes.xyxy)  # все найденные лошади в кадре
    sec = int(idx // fps)
    counts_per_sec[sec] = max(counts_per_sec[sec], horse_count)

    # отправляем progress в stdout
    if idx % int(fps) == 0:
        progress = int(idx / frame_count * 100)
        print(f"PROGRESS: {progress}", flush=True)

cap.release()

# финальный прогресс
print("PROGRESS: 100", flush=True)

# сохраняем JSON
result = [{"second": i, "horses": counts_per_sec[i]} for i in range(seconds)]
with open(OUTPUT, 'w', encoding='utf8') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)