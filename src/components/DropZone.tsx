import React from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './DropZone.module.css';

interface Props {
  onFileAccepted: (file: File) => void;
}

const DropZone: React.FC<Props> = ({ onFileAccepted }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': [] },
    maxSize: 500 * 1024 * 1024, // 500 MB
    multiple: false,
    onDropAccepted: files => onFileAccepted(files[0]),
  });

  return (
    <div
      {...getRootProps()}
      className={`${styles.zone} ${isDragActive ? styles.active : ''}`}
    >
      <input {...getInputProps()} />
      <p>Перетащите видео сюда или кликните, чтобы выбрать файл</p>
    </div>
  );
};

export default DropZone;