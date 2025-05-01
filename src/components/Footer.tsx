import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerBackground} />
      <div className={styles.footerContent}>
        <p>Иван Кашин БВТ2103 МТУСИ</p>
      </div>
    </footer>
  );
};

export default Footer;