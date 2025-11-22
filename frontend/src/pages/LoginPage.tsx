import styled from 'styled-components';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { useAuth } from '@/contexts/AuthContext';

// --- Styled Components (Shared Layout) ---

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
  font-family: 'Xilosa', sans-serif;
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

// --- Styled Components (Specific to Form) ---

const StyledForm = styled(Form)`
  padding: 2rem !important;

  /* Overrides para os elementos internos do Form */
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

  /* Links gerais dentro do form */
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

  /* Link específico de recuperar senha (se comportava diferente no CSS original, mas aqui uniformizei para branco conforme css: a[href*="recuperar"]) */
  a[href*="recuperar"] {
    color: #ffffff !important;
    &:hover {
      color: #b0b0b0 !important;
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

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee;
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #c33;
  margin-bottom: 16px;
  font-size: 14px;
`;

// --- Logic ---

function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formError, setFormError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
    if (formError) setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError('');

    try {
      await login(formData);
      navigate('/');
    } catch (err: any) {
      setFormError(error || 'Falha ao fazer login. Tente novamente.');
    }
  };

  return (
    <PageContainer>
      {/* Lado Esquerdo - Branding */}
      <LeftSection>
        <BrandingContent>
          <AppName>Rota Cultural</AppName>
          <AppDescription>
            Descubra os melhores eventos culturais, pontos turísticos e crie roteiros personalizados na cidade de Patos - PB.
          </AppDescription>

          <FeaturesList>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26H22L17.45 12.74L19.54 19L12 15.27L4.46 19L6.55 12.74L2 8.26H8.91L12 2Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </FeatureIcon>
              <FeatureText>Eventos Culturais</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 15.3L12.5 12.4V7Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </FeatureIcon>
              <FeatureText>Pontos Turísticos</FeatureText>
            </FeatureItem>
          </FeaturesList>
        </BrandingContent>
      </LeftSection>

      {/* Lado Direito - Formulário */}
      <RightSection>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Header>Bem-vindo de volta!</Form.Header>

            {(error || formError) && (
              <ErrorMessage>
                {error || formError}
              </ErrorMessage>
            )}

            <Form.Field>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Input
                id="email"
                name="email"
                type="email"
                placeholder="seu@email.com"
                icon={<Mail size={20} />}
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="password">Senha</Form.Label>
              <Form.Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

            <Form.ForgotPassword href="/recuperar-senha">Esqueceu a senha?</Form.ForgotPassword>

            <SubmitButton disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </SubmitButton>

            <Form.SignUp
              prefix="Não tem uma conta?"
              linkText="Crie uma"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/cadastro');
              }}
            />
          </StyledForm>
        </FormContainer>
      </RightSection>
    </PageContainer>
  );
}

export default LoginPage;