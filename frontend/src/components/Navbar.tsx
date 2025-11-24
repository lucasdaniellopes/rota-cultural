import { useState } from 'react';
import styled, { css } from 'styled-components';
import { Home, Calendar, Map, MapPin, LogOut, Heart, User, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// --- Styled Components ---

const NavbarWrapper = styled.nav`
  width: 100%;
  background-color: #141414;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 70px;

  @media (max-width: 1024px) {
    padding: 0 1rem;
    height: 65px;
  }

  @media (max-width: 768px) {
    padding: 0 0.75rem;
    height: 60px;
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;
    height: 55px;
  }
`;

const NavItemsList = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex: 1;
  margin: 0 2rem;

  @media (max-width: 1024px) {
    margin: 0 1rem;
  }

  @media (max-width: 768px) {
    margin: 0 0.5rem;
    gap: 0.25rem;
  }

  @media (max-width: 480px) {
    margin: 0;
  }
`;

// Mixin para estilos comuns de botões de navegação
const NavButtonBase = css<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.$isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border-bottom: 3px solid ${props => props.$isActive ? '#ffffff' : 'transparent'};
  margin-bottom: -3px;

  &:hover {
    color: #ffffff;
  }

  @media (max-width: 1024px) {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.35rem;
  }
`;

const NavItem = styled.button<{ $isActive?: boolean }>`
  ${NavButtonBase}
`;

const LabelText = styled.span`
  display: inline;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.35rem;
  }
`;

const FavoritesButton = styled.button<{ $isActive?: boolean }>`
  ${NavButtonBase}
  /* Estilos específicos se necessário, mas herda a base do NavItem */
`;

const UserMenuContainer = styled.div`
  position: relative;
`;

const UserMenuButton = styled.button<{ $isActive?: boolean }>`
  ${NavButtonBase}
`;

const ChevronIconWrapper = styled.div`
  display: inline-flex;
  transition: transform 0.2s ease;

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  min-width: 200px;
  margin-top: 0.5rem;
  z-index: 1000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const DropdownItem = styled.button<{ $isLogout?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;

  &:hover {
    background-color: ${props => props.$isLogout ? 'rgba(244, 68, 68, 0.1)' : 'rgba(102, 126, 234, 0.1)'};
    color: #ffffff;
  }
`;

const LoginButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background-color: rgba(102, 126, 234, 0.9);
  border: 1px solid rgba(102, 126, 234, 1);
  border-radius: 0.375rem;
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: rgba(102, 126, 234, 1);
    border-color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.4rem 0.5rem;
  }
`;

// --- Component Logic ---

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Home, href: '/' },
    { id: 'eventos', label: 'Eventos', icon: Calendar, href: '/eventos' },
    { id: 'pontos', label: 'Pontos Turísticos', icon: MapPin, href: '/pontos-turisticos' },
    { id: 'mapa', label: 'Mapa', icon: Map, href: '/mapa' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    await logout();
    navigate('/entrar');
  };

  return (
    <NavbarWrapper>
      <Container>
        <NavItemsList>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavItem
                key={item.id}
                onClick={() => navigate(item.href)}
                $isActive={isActive(item.href)}
                title={item.label}
              >
                <Icon size={20} />
                <LabelText>{item.label}</LabelText>
              </NavItem>
            );
          })}
        </NavItemsList>

        {isAuthenticated && user ? (
          <ActionButtons>
            <FavoritesButton
              onClick={() => navigate('/favoritos')}
              $isActive={isActive('/favoritos')}
              title="Meus Favoritos"
            >
              <Heart size={20} />
              <LabelText>Meus Favoritos</LabelText>
            </FavoritesButton>

            <UserMenuContainer>
              <UserMenuButton
                onClick={() => setShowUserMenu(!showUserMenu)}
                $isActive={isActive('/perfil')}
                title="Opções do usuário"
              >
                <User size={20} />
                <LabelText>
                  {user.full_name || user.username}
                </LabelText>
                <ChevronIconWrapper>
                  <ChevronDown size={16} />
                </ChevronIconWrapper>
              </UserMenuButton>

              {showUserMenu && (
                <UserDropdown>
                  <DropdownItem
                    onClick={() => {
                      navigate('/perfil');
                      setShowUserMenu(false);
                    }}
                  >
                    <User size={18} />
                    <span>Meu Perfil</span>
                  </DropdownItem>
                  <DropdownItem
                    $isLogout
                    onClick={() => {
                      handleLogout();
                      setShowUserMenu(false);
                    }}
                  >
                    <LogOut size={18} />
                    <span>Sair</span>
                  </DropdownItem>
                </UserDropdown>
              )}
            </UserMenuContainer>
          </ActionButtons>
        ) : (
          <ActionButtons>
            <LoginButton onClick={() => navigate('/entrar')}>
              Entrar
            </LoginButton>
          </ActionButtons>
        )}
      </Container>
    </NavbarWrapper>
  );
}

export default Navbar;