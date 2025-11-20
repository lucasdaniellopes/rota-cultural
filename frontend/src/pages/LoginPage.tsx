import { Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import styles from '@/styles/LoginPage.module.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className={styles['login-page-container']}>
      {/* Lado Esquerdo - Branding */}
      <div className={styles['left-section']}>
        <div className={styles['branding-content']}>
          <h1 className={styles['app-name']}>Rota Cultural</h1>
          <p className={styles['app-description']}>
            Descubra os melhores eventos culturais, pontos turísticos e crie roteiros personalizados na cidade de Patos - PB.
          </p>
          
          <div className={styles['features-list']}>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26H22L17.45 12.74L19.54 19L12 15.27L4.46 19L6.55 12.74L2 8.26H8.91L12 2Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles['feature-text']}>Eventos Culturais</span>
            </div>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 15.3L12.5 12.4V7Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Pontos Turísticos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className={styles['right-section']}>
        <div className={styles['form-container']}>
          <Form onSubmit={handleSubmit} className={styles['login-form']}>
            <Form.Header>Bem-vindo de volta!</Form.Header>
            
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

            <Form.Field>
              <Form.Label htmlFor="password">Senha</Form.Label>
              <Form.Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock size={20} />} 
                required 
              />
            </Form.Field>

            <Form.ForgotPassword href="/recuperar-senha">Esqueceu a senha?</Form.ForgotPassword>

            <Form.Button className={styles['submit-button']}>Entrar</Form.Button>

            <Form.SignUp 
              prefix="Não tem uma conta?" 
              linkText="Crie uma" 
              href="#" 
              onClick={(e) => { 
                e.preventDefault(); 
                navigate('/cadastro'); 
              }} 
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
