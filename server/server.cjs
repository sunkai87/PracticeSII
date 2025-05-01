/* server/server.cjs */
const express  = require('express');
const cors     = require('cors');
const multer   = require('multer');
const { v4: uuid } = require('uuid');
const { spawn } = require('child_process');
const path     = require('path');
const fs       = require('fs');
const tasks    = require('./tasks.cjs');

const app  = express();
app.use(cors());
app.use(express.json());

const UPLOAD_DIR = path.join(__dirname, 'uploads');
const OUTPUT_DIR = path.join(__dirname, 'output');
const HIST_FILE  = path.join(__dirname, 'history.json');

// ─── storage ────────────────────────────────────────────────────────────
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);
if (!fs.existsSync(HIST_FILE))  fs.writeFileSync(HIST_FILE, '[]', 'utf8');

// Multer: сохраняем видео как <taskId>.ext
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const taskId = req.taskId;
    const ext    = path.extname(file.originalname);
    cb(null, `${taskId}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } }); // 500 MB

// ─── POST /api/upload ───────────────────────────────────────────────────
app.post('/api/upload', (req, res, next) => {
  req.taskId = uuid();
  next();
}, upload.single('video'), (req, res) => {
  const { taskId }  = req;
  const inPath      = req.file.path;
  const outJsonPath = path.join(OUTPUT_DIR, `${taskId}.json`);

  // записываем в историю
  //const hist = JSON.parse(fs.readFileSync(HIST_FILE, 'utf8'));
  const hist = safeReadHistory();
  hist.push({ id: taskId, file: req.file.originalname, date: new Date(), status: 'processing' });
  fs.writeFileSync(HIST_FILE, JSON.stringify(hist, null, 2));

  // стартуем python-скрипт
  const py = spawn('python', [
      path.join(__dirname, 'yolo_runner.py'),
      inPath,
      outJsonPath,
      taskId        // для tqdm-progress
  ]);

  py.stderr.on('data', chunk => {
    console.error('[PY-ERR]', chunk.toString());
  });

  // ловим stdout -> progress
  py.stdout.on('data', chunk => {
    // yolo_runner выводит "PROGRESS: 23"
    console.log('[PY]', chunk.toString());
    const match = chunk.toString().match(/PROGRESS:\s(\d+)/);
    if (match) tasks.updateProgress(taskId, Number(match[1]));
  });


  py.on('close', code => {
    console.log(`[PY] exit code ${code}`);
    tasks.updateProgress(taskId, 100);
    // апдейтим историю
    //const hist = JSON.parse(fs.readFileSync(HIST_FILE, 'utf8'));
    //const rec  = hist.find(h => h.id === taskId);
    const hist2 = safeReadHistory();
    const rec = hist2.find(h => h.id === taskId);
    if (rec) rec.status = code === 0 ? 'done' : 'error';
    fs.writeFileSync(HIST_FILE, JSON.stringify(hist2, null, 2));
  });

  // сохраняем задачу
  tasks.add(taskId);

  res.json({ id: taskId });
});

function safeReadHistory() {
    try {
      const raw = fs.readFileSync(HIST_FILE, 'utf8');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

// ─── GET /api/progress/:id ──────────────────────────────────────────────
// app.get('/api/progress/:id', (req, res) => {
//   const { id } = req.params;
//   res.json({ progress: tasks.getProgress(id) ?? 0 });
// });
app.get('/api/progress/:id', (req, res) => {
    const { id } = req.params;
    const p = tasks.getProgress(id) ?? 0;
    const hist = JSON.parse(fs.readFileSync(HIST_FILE, 'utf8') || '[]');
    const rec  = hist.find(h => h.id === id);
    const status = rec ? rec.status : 'processing';
    return res.json({ progress: p, status });
});


// ─── GET /api/result/:id ────────────────────────────────────────────────
// app.get('/api/result/:id', (req, res) => {
//   const file = path.join(OUTPUT_DIR, `${req.params.id}.json`);
//   if (!fs.existsSync(file)) return res.status(404).json({ error: 'not ready' });
//   res.sendFile(file);
// });

app.get('/api/result/:id', (req, res) => {
    const file = path.join(OUTPUT_DIR, `${req.params.id}.json`);
    if (!fs.existsSync(file)) return res.status(202).json({ message: 'processing' });
    res.sendFile(file);
});

// ─── GET /api/history ───────────────────────────────────────────────────
app.get('/api/history', (_req, res) => {
  res.sendFile(HIST_FILE);
});

// ─── start ──────────────────────────────────────────────────────────────
const PORT = 4000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));