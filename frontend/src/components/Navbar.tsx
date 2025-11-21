import { useState } from 'react';
import { Home, Calendar, Map, MapPin, LogOut, Heart, User, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home, href: '/' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, href: '/eventos' },
    { id: 'mapa', label: 'Mapa', icon: Map, href: '/mapa' },
    { id: 'pontos', label: 'Pontos Turísticos', icon: MapPin, href: '/pontos-turisticos' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    await logout();
    navigate('/entrar');
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

        {isAuthenticated && user ? (
          <div className={styles['action-buttons']}>
            <button 
              onClick={() => navigate('/favoritos')} 
              className={`${styles['favorites-btn']} ${isActive('/favoritos') ? styles.active : ''}`}
              title="Meus Favoritos"
            >
              <Heart size={20} className={styles['favorites-icon']} />
              <span className={styles['favorites-label']}>Meus Favoritos</span>
            </button>

            <div className={styles['user-menu-container']}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`${styles['user-menu-btn']} ${isActive('/perfil') ? styles.active : ''}`}
                title="Opções do usuário"
              >
                <User size={20} className={styles['user-icon']} />
                <span className={styles['user-label']}>
                  {user.first_name || user.username}
                </span>
                <ChevronDown size={16} className={styles['chevron-icon']} />
              </button>

              {showUserMenu && (
                <div className={styles['user-dropdown']}>
                  <button
                    onClick={() => {
                      navigate('/perfil');
                      setShowUserMenu(false);
                    }}
                    className={styles['dropdown-item']}
                  >
                    <User size={18} />
                    <span>Meu Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                    className={styles['dropdown-item logout']}
                  >
                    <LogOut size={18} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles['action-buttons']}>
            <button
              onClick={() => navigate('/entrar')}
              className={styles['login-btn']}
            >
              Entrar
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;