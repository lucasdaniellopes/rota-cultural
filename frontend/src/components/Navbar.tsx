import { Home, Calendar, Map, MapPin, LogOut, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from '../styles/Navbar.module.css';

interface NavbarProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

function Navbar({ isAuthenticated = true, onLogout }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home, href: '/' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, href: '/eventos' },
    { id: 'mapa', label: 'Mapa', icon: Map, href: '/map' },
    { id: 'pontos', label: 'Pontos Turísticos', icon: MapPin, href: '/pontos-turisticos' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles['navbar-container']}>

        <div className={styles['nav-items']}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.href)}
                className={`${styles['nav-item']} ${isActive(item.href) ? styles.active : ''}`}
                title={item.label}
              >
                <Icon size={20} className={styles['nav-icon']} />
                <span className={styles['nav-label']}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {isAuthenticated && (
          <div className={styles['action-buttons']}>
            <button 
              onClick={() => navigate('/favoritos')} 
              className={`${styles['favorites-btn']} ${isActive('/favoritos') ? styles.active : ''}`}
              title="Meus Favoritos"
            >
              <Heart size={20} className={styles['favorites-icon']} />
              <span className={styles['favorites-label']}>Meus Favoritos</span>
            </button>
            <button onClick={handleLogout} className={styles['logout-btn']}>
              <LogOut size={20} className={styles['logout-icon']} />
              <span className={styles['logout-label']}>Entrar</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;