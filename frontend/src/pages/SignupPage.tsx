import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/SignupPage.module.css';

interface SignupFormData {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

function SignupPage() {
  const navigate = useNavigate();
  const { signup, isLoading, error, clearError } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    username: '',
    first_name: '',
    last_name: '',
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
    if (!formData.username.trim()) {
      setFormError('Nome de usuário é obrigatório');
      return;
    }

    if (formData.username.length < 3) {
      setFormError('Nome de usuário deve ter pelo menos 3 caracteres');
      return;
    }

    if (!formData.first_name.trim()) {
      setFormError('Nome é obrigatório');
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
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
      });
      navigate('/');
    } catch (err: any) {
      setFormError(error || 'Falha ao registrar. Tente novamente.');
    }
  };

  return (
    <div className={styles['signup-page-container']}>
      {/* Lado Esquerdo - Branding */}
      <div className={styles['left-section']}>
        <div className={styles['branding-content']}>
          <h1 className={styles['app-name']}>Rota Cultural</h1>
          <p className={styles['app-description']}>
            Junte-se à nossa comunidade e descubra os melhores eventos culturais e pontos turísticos de Patos - PB. Crie sua conta e comece a explorar agora!
          </p>

          <div className={styles['features-list']}>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Criar Conteúdo</span>
            </div>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Salvar Favoritos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className={styles['right-section']}>
        <div className={styles['form-container']}>
          <Form onSubmit={handleSubmit} className={styles['signup-form']}>
            <Form.Header>Criar sua conta</Form.Header>

            {(error || formError) && (
              <div style={{
                padding: '12px',
                backgroundColor: '#fee',
                borderLeft: '4px solid #f44',
                borderRadius: '4px',
                color: '#c33',
                marginBottom: '16px',
                fontSize: '14px'
              }}>
                {error || formError}
              </div>
            )}

            <Form.Field>
              <Form.Label htmlFor="username">Nome de Usuário</Form.Label>
              <Form.Input
                id="username"
                name="username"
                type="text"
                placeholder="seu_usuario"
                icon={<User size={20} />}
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="first_name">Nome</Form.Label>
              <Form.Input
                id="first_name"
                name="first_name"
                type="text"
                placeholder="Seu nome"
                icon={<User size={20} />}
                value={formData.first_name}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </Form.Field>

            <Form.Field>
              <Form.Label htmlFor="last_name">Sobrenome</Form.Label>
              <Form.Input
                id="last_name"
                name="last_name"
                type="text"
                placeholder="Seu sobrenome"
                icon={<User size={20} />}
                value={formData.last_name}
                onChange={handleChange}
                disabled={isLoading}
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

            <Form.Button disabled={isLoading} className={styles['submit-button']}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Form.Button>

            <Form.SignUp
              prefix="Já possui uma conta?"
              linkText="Fazer login"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/entrar');
              }}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
