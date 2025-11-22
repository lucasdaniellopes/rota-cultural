import styled from 'styled-components';
import { User } from 'lucide-react';
import { Icon } from '@iconify/react';

// --- Styled Components ---

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  max-width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }

  @media (max-width: 640px) {
    padding: 0.5rem 0.75rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 3.5rem;
  width: auto;

  @media (max-width: 768px) {
    height: 2.5rem;
  }

  @media (max-width: 480px) {
    height: 2rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 640px) {
    gap: 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
  position: relative;

  &:hover {
    color: #1f2937;
  }

  /* Linha inferior animada */
  &::after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3b82f6;
    transition: width 0.2s ease;
  }

  &:hover::after,
  &.active::after {
    width: 100%;
  }

  &.active {
    color: #3b82f6;
  }

  /* Ícone dentro do link */
  svg {
    font-size: 1.1rem;
  }

  /* Responsividade */
  @media (max-width: 768px) {
    font-size: 0.875rem;
    
    svg {
      font-size: 1rem;
    }
  }

  @media (max-width: 640px) {
    font-size: 0.8rem;
    flex-direction: column;
    gap: 0.25rem;

    svg {
      font-size: 1.2rem;
    }
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;

    svg {
      font-size: 1.1rem;
    }
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #f3f4f6;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e5e7eb;
    border-color: #d1d5db;
    color: #4b5563;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 2rem;
    height: 2rem;
    
    /* Ajusta o tamanho do ícone Lucide dentro do botão se necessário */
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// --- Component ---

function Header() {
  return (
    <HeaderContainer>
      <HeaderContent>

        <LogoSection>
          <LogoImage src="/RotaCultural.png" alt="Rota Cultural" />
        </LogoSection>

        <Navigation>
          <NavLink href="#">
            <Icon icon="carbon:home" />
            Início
          </NavLink>
          <NavLink href="#">
            <Icon icon="carbon:map" />
            Mapa
          </NavLink>
          <NavLink href="#">
            <Icon icon="carbon:location" />
            Pontos Turísticos
          </NavLink>
          <NavLink href="#">
            <Icon icon="carbon:3d-curve-auto-colon" />
            Roteiros
          </NavLink>
        </Navigation>

        <ProfileSection>
          <ProfileButton>
            <User size={20} />
          </ProfileButton>
        </ProfileSection>
        
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;