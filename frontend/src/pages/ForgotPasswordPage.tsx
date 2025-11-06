import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import styles from '@/styles/ForgotPasswordPage.module.css';

function ForgotPasswordPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Forgot password form submitted');
    // TODO: Implement forgot password logic
  };

  return (
    <div className={styles['forgot-password-page-container']}>
      {/* Lado Esquerdo - Branding */}
      <div className={styles['left-section']}>
        <div className={styles['branding-content']}>
          <h1 className={styles['app-name']}>Rota Cultural</h1>
          <p className={styles['app-description']}>
            Perdeu seu acesso? Sem problema! Vamos ajudá-lo a recuperar sua senha e voltar para explorar os melhores eventos culturais da cidade de Patos - PB.
          </p>
          
          <div className={styles['features-list']}>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 4.9 16.1 4 15 4H9C7.9 4 7 4.9 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM9 6H15V8H9V6ZM18 20H6V10H18V20Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Segurança Garantida</span>
            </div>
            <div className={styles['feature-item']}>
              <svg className={styles['feature-icon']} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 5L5 8V11C5 14.89 7.64 18.36 11 19.71V5H12Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Proteção de Dados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className={styles['right-section']}>
        <div className={styles['form-container']}>
          <Form onSubmit={handleSubmit} className={styles['forgot-form']}>
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

            <Form.Button className={styles['submit-button']}>Enviar instruções</Form.Button>

            <Form.SignUp 
              prefix="Lembrou a senha?" 
              linkText="Voltar ao login" 
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

export default ForgotPasswordPage;
