// src/api/horseApi.ts
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:4000/api',
});

export const uploadVideo = async (file: File) => {
  const form = new FormData();
  form.append('video', file);
  const { data } = await API.post<{ id: string }>('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.id;
};

// export const getProgress = async (id: string) => {
//   const { data } = await API.get<{ progress: number }>(`/progress/${id}`);
//   return data.progress;
// };

export const getProgress = async (id: string) => {
    const { data } = await API.get<{ progress: number; status: string }>(`/progress/${id}`);
    return data;
};



export type THorseStat = { second: number; horses: number };

export const getResult = async (id: string) => {
  const { data } = await API.get<THorseStat[]>(`/result/${id}`);
  return data;
};

export type THistoryRec = {
  id: string;
  file: string;
  date: string;
  status: 'processing' | 'done' | 'error';
};

export const getHistory = async () => {
  const { data } = await API.get<THistoryRec[]>('/history');
  return data;
};