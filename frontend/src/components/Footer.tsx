import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const FooterContainer = styled.footer`
  width: 100%;
  background: #1a1a1a;
  padding: 2rem 1.5rem 1.5rem;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

const FooterText = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const EvaluateLink = styled.a`
  color: #667eea;
  text-decoration: underline;
  cursor: pointer;
  font-weight: 600;
  transition: color 0.2s ease;

  &:hover {
    color: #5568d3;
  }
`;

const Copyright = styled.p`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

function Footer() {
  const navigate = useNavigate();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterText>
          Gostou do site? <EvaluateLink onClick={() => navigate('/avaliacoes')}>Avalie</EvaluateLink>
        </FooterText>

        <Copyright>
          © {new Date().getFullYear()} Rota Cultural. Todos os direitos reservados.
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
}

export default Footer;
