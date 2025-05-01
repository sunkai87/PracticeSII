import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DropZone from '../../components/DropZone';
import { uploadVideo, getProgress } from '../../api/horseApi';
import styles from './Upload.module.css';

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const startUpload = async (f: File) => {
    try {
      setError(null);
      const id = await uploadVideo(f);
      setTaskId(id);
      setFile(f);
    } catch (err) {
      setError('Не удалось отправить файл.');
    }
  };

  // опрос прогресса
  useEffect(() => {
    if (!taskId) return;
    const timer = setInterval(async () => {
      try {
        // const p = await getProgress(taskId);
        // setProgress(p);
        // if (p >= 100) {
        //   clearInterval(timer);
        //   navigate(`/results?id=${taskId}`);
        // }
        const { progress: p, status } = await getProgress(taskId);
        setProgress(p);
        if (status === 'done') {
          clearInterval(timer);
          navigate(`/results?id=${taskId}`);
        }
        if (status === 'error') {
          clearInterval(timer);
          setError('Ошибка обработки видео.');
        }
      } catch {
        clearInterval(timer);
        setError('Ошибка при получении прогресса.');
      }
    }, 1500);
    return () => clearInterval(timer);
  }, [taskId, navigate]);

  return (
    <div className={styles.container}>
      <h1>Загрузите видео для обработки</h1>

      {!file && <DropZone onFileAccepted={startUpload} />}

      <p className={styles.hint}>
        Поддерживаемые расширения: MP4, MOV, AVI • до 500 MB
      </p>

      {file && (
        <div className={styles.progressWrap}>
          <p>{file.name}</p>
          <div className={styles.bar}>
            <div className={styles.inner} style={{ width: `${progress}%` }} />
          </div>
          <p>{progress}%</p>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default Upload;
