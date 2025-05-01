Для того, чтобы запустить проект необходимо прописать в консоли в корне проекта:

```
node server\server.cjs

yarn build

yarn dev
```

Для того, чтобы получить статистику по ролику, находящемуся в корне проекта можно использовать

```
python server\yolo_runner.py videp.mp4 test.json temp
```

Требования библиотек для работы с YOLO и python

```
numpy==1.26.4
torch==2.2.0
ultralytics==8.1.0
opencv-python
tqdm
ffmpeg-python
```

Библиотеки для работы с веб-интерфейсом

```
express
multer
cors
uuid
react
react-dom
react-router-dom
axios
react-dropzone
recharts
jspdf
html2canvas
dayjs
```
