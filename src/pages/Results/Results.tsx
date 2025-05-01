import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { getResult, THorseStat, getHistory, THistoryRec } from '../../api/horseApi';
import dayjs from 'dayjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './Results.module.css';

const Results: React.FC = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(search);
  const taskId = query.get('id');

  const [data, setData] = useState<THorseStat[] | null>(null);
  const [history, setHistory] = useState<THistoryRec[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const chartRef = useRef<HTMLDivElement>(null);

  // Загружаем результаты
  useEffect(() => {
    if (!taskId) {
      setErr('Для начала загрузите видеоролик.');
      return;
    }
    getResult(taskId)
      .then(setData)
      .catch(() => setErr('Результат ещё не готов или возникла ошибка.'));
    // история
    getHistory()
      .then(setHistory)
      .catch(() => {/* игнор */});
  }, [taskId]);

  // Экспорт PDF
  const handleExportPdf = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 10, width, height);
    pdf.save(`horse_stats_${taskId}.pdf`);
  };

  if (err)
    return (
      <div className={styles.container}>
        <p className={styles.error}>{err}</p>
        <button className={styles.btn} onClick={() => navigate('/upload')}>
          Загрузить видео
        </button>
      </div>
    );

  if (!data)
    return (
      <div className={styles.container}>
        <p>Загружаем статистику…</p>
      </div>
    );

  return (
    <div className={styles.container}>
      <h1>Статистика: количество лошадей по секундам</h1>

      <div ref={chartRef} className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid stroke="#e5dcc8" />
            <XAxis dataKey="second" label={{ value: 'секунда', position: 'insideBottom', dy: 10 }} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(v: number) => `${v} лошадей`} />
            <Bar dataKey="horses" fill="#b29b7e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <button className={styles.btn} onClick={handleExportPdf}>
        Скачать PDF
      </button>

      <h2 className={styles.subTitle}>История запросов</h2>
      <ul className={styles.history}>
        {history
          .slice()
          .reverse()
          .map(h => (
            <li key={h.id}>
              <span className={styles.histFile}>{h.file}</span>
              <span className={styles.histDate}>
                {dayjs(h.date).format('DD.MM.YYYY HH:mm')}
              </span>
              <span
                className={
                  h.status === 'done'
                    ? styles.done
                    : h.status === 'processing'
                    ? styles.proc
                    : styles.err
                }
              >
                {h.status}
              </span>
              {h.status === 'done' && (
                <button
                  onClick={() => navigate(`/results?id=${h.id}`)}
                  className={styles.smallBtn}
                >
                  открыть
                </button>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Results;