import styled from 'styled-components';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';

// --- Styled Components ---

const PageContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 40%;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  font-family: 'Inter', sans-serif;

  @media (max-width: 1024px) {
    grid-template-columns: 50% 50%;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const LeftSection = styled.div`
  background-color: #141414;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    min-height: 50vh;
    justify-content: flex-end;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
    min-height: auto;
  }
`;

const BrandingContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 500px;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1.2rem;
  }
`;

const AppName = styled.h1`
  font-family: 'Xilosa', sans-serif; /* Certifique-se que a fonte está carregada no index.html */
  font-size: 4rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  letter-spacing: -1px;

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const AppDescription = styled.p`
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: #ffffff;
  margin: 0;
  line-height: 1.6;
  font-weight: 300;

  @media (max-width: 1024px) {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FeaturesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 1.2rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
`;

const FeatureIcon = styled.svg`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
`;

const FeatureText = styled.span`
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #ffffff;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const RightSection = styled.div`
  background-color: #212121;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    min-height: 50vh;
    padding: 2rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 380px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

// Estilizando o componente Form existente
// Usamos !important aqui para garantir o override sobre os estilos internos do Form (como no CSS original)
const StyledForm = styled(Form)`
  padding: 2rem !important;

  h2 {
    color: #ffffff !important;
    font-weight: 700;
    font-size: 1.875rem;
  }

  label {
    color: #ffffff !important;
    font-weight: 600;
  }

  p {
    color: #ffffff !important;
  }

  a {
    color: #667eea !important;
    font-weight: 700 !important;
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
      color: #7b9eff !important;
      text-decoration: underline !important;
    }
  }
`;

const SubmitButton = styled(Form.Button)`
  background-color: #141414 !important;
  color: #ffffff !important;
  font-weight: 600;
  border: none !important;
  transition: all 0.3s ease !important;

  &:hover:not(:disabled) {
    background-color: #000000 !important;
    transform: translateY(-2px);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    background-color: #3a3a3a !important;
    opacity: 0.6;
  }
`;

// --- Component Logic ---

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Forgot password form submitted');
    // TODO: Implement forgot password logic
  };

  return (
    <PageContainer>
      {/* Lado Esquerdo - Branding */}
      <LeftSection>
        <BrandingContent>
          <AppName>Rota Cultural</AppName>
          <AppDescription>
            Perdeu seu acesso? Sem problema! Vamos ajudá-lo a recuperar sua senha e voltar para explorar os melhores eventos culturais da cidade de Patos - PB.
          </AppDescription>
          
          <FeaturesList>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 4.9 16.1 4 15 4H9C7.9 4 7 4.9 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6H15V8H9V6ZM18 20H6V10H18V20Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </FeatureIcon>
              <FeatureText>Segurança Garantida</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 5L5 8V11C5 14.89 7.64 18.36 11 19.71V5H12Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </FeatureIcon>
              <FeatureText>Proteção de Dados</FeatureText>
            </FeatureItem>
          </FeaturesList>
        </BrandingContent>
      </LeftSection>

      {/* Lado Direito - Formulário */}
      <RightSection>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Header>Redefinir sua senha</Form.Header>
            
            <Form.Description>
              Insira seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
            </Form.Description>

            <Form.Field>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                icon={<Mail size={20} />} 
                required 
              />
            </Form.Field>

            <SubmitButton>Enviar instruções</SubmitButton>

            <Form.SignUp 
              prefix="Lembrou a senha?" 
              linkText="Voltar ao login" 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/entrar'); 
              }} 
            />
          </StyledForm>
        </FormContainer>
      </RightSection>
    </PageContainer>
  );
}

export default ForgotPasswordPage;