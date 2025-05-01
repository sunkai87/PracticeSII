// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => (
  <header className={styles.head}>
    <h2 className={styles.logo}>Horse&nbsp;Monitor</h2>
    <nav className={styles.nav}>
      <NavLink to="/" end className={({ isActive }) => isActive ? styles.active : ''}>
        Главная
      </NavLink>
      <NavLink to="/upload" className={({ isActive }) => isActive ? styles.active : ''}>
        Загрузка
      </NavLink>
      <NavLink to="/results" className={({ isActive }) => isActive ? styles.active : ''}>
        Результаты
      </NavLink>
    </nav>
  </header>
);

export default Header;