// src/pages/Home.tsx
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => (
  <div className={styles.wrap}>
    <h1>Сервис учёта лошадей на ипподроме</h1>

    <p className={styles.lead}>
      Загрузите видеоролик, и модель&nbsp;YOLO автоматически
      определит количество лошадей в вашем видеоролике&nbsp; на каждой секунде. В&nbsp;итоге вы
      получите наглядную гистограмму и сможете сохранить данную статистику в&nbsp;PDF.
    </p>

    <div className={styles.steps}>
      <div className={styles.card}>
        <span className={styles.num}>1</span>
        <h3>Загрузите видео</h3>
        <p>Drag-and-Drop или кнопка «Выбрать файл» (MP4/MOV/AVI).</p>
      </div>
      <div className={styles.card}>
        <span className={styles.num}>2</span>
        <h3>Подождите обработки</h3>
        <p>Покажем прогресс в процентах в&nbsp;реальном времени.</p>
      </div>
      <div className={styles.card}>
        <span className={styles.num}>3</span>
        <h3>Скачайте результат</h3>
        <p>Гистограмма + PDF. Вся история хранится на&nbsp;сервере.</p>
      </div>
    </div>

    <Link to="/upload" className={styles.cta}>
      Начать
    </Link>
  </div>
);

export default Home;