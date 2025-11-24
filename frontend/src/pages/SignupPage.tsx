import styled from 'styled-components';
import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { useAuth } from '@/contexts/AuthContext';

// --- Styled Components (Reused Structure) ---
// Nota: Estou redeclarando aqui para manter os arquivos independentes como solicitado, 
// mas em um projeto real você poderia extrair isso para um LayoutWrapper.

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

// --- Styled Form Overrides ---

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

const ErrorMessage = styled.div`
  padding: 12px;
  background-color: #fee;
  border-left: 4px solid #f44;
  border-radius: 4px;
  color: #c33;
  margin-bottom: 16px;
  font-size: 14px;
`;

interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    full_name: '',
    email: '',
    password: '',
    password_confirm: '',
  });
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

    // Validações básicas
    if (!formData.full_name.trim()) {
      setFormError('Nome completo é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      setFormError('E-mail é obrigatório');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Senha deve ter pelo menos 8 caracteres');
      return;
    }

    if (formData.password !== formData.password_confirm) {
      setFormError('Senhas não coincidem');
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm,
        full_name: formData.full_name,
      });
      navigate('/');
    } catch (err: any) {
      setFormError(error || 'Falha ao registrar. Tente novamente.');
    }
  };

  return (
    <PageContainer>
      {/* Lado Esquerdo - Branding */}
      <LeftSection>
        <BrandingContent>
          <AppName>Rota Cultural</AppName>
          <AppDescription>
            Junte-se à nossa comunidade e descubra os melhores eventos culturais e pontos turísticos de Patos - PB. Crie sua conta e comece a explorar agora!
          </AppDescription>

          <FeaturesList>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5" />
              </FeatureIcon>
              <FeatureText>Criar Conteúdo</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5" />
              </FeatureIcon>
              <FeatureText>Salvar Favoritos</FeatureText>
            </FeatureItem>
          </FeaturesList>
        </BrandingContent>
      </LeftSection>

      {/* Lado Direito - Formulário */}
      <RightSection>
        <FormContainer>
          <StyledForm onSubmit={handleSubmit}>
            <Form.Header>Criar sua conta</Form.Header>

            {(error || formError) && (
              <ErrorMessage>
                {error || formError}
              </ErrorMessage>
            )}

            <Form.Field>
              <Form.Label htmlFor="full_name">Nome Completo</Form.Label>
              <Form.Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Seu nome completo"
                icon={<User size={20} />}
                value={formData.full_name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

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

            <Form.Field>
              <Form.Label htmlFor="password_confirm">Confirmar Senha</Form.Label>
              <Form.Input
                id="password_confirm"
                name="password_confirm"
                type="password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={formData.password_confirm}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

            <SubmitButton disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </SubmitButton>

            <Form.SignUp
              prefix="Já possui uma conta?"
              linkText="Fazer login"
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

export default SignupPage;