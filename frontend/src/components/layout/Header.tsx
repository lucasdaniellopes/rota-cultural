import { User } from 'lucide-react';
import { Icon } from '@iconify/react';
import styles from '@/styles/Header.module.css';

function Header() {
  return (
    <header className={styles['header-container']}>
      <div className={styles['header-content']}>

        <div className={styles['logo-section']}>
          <img src="/RotaCultural.png" alt="Rota Cultural" className={styles['logo-image']} />
        </div>

        <nav className={styles['navigation']}>
          <a href="#" className={styles['nav-link']}>
            <Icon icon="carbon:home" className={styles['nav-icon']} />
            Início
          </a>
          <a href="#" className={styles['nav-link']}>
            <Icon icon="carbon:map" className={styles['nav-icon']} />
            Mapa
          </a>
          <a href="#" className={styles['nav-link']}>
            <Icon icon="carbon:location" className={styles['nav-icon']} />
            Pontos Turísticos
          </a>
          <a href="#" className={styles['nav-link']}>
            <Icon icon="carbon:3d-curve-auto-colon" className={styles['nav-icon']} />
            Roteiros
          </a>
        </nav>

        <div className={styles['profile-section']}>
          <button className={styles['profile-button']}>
            <User size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;