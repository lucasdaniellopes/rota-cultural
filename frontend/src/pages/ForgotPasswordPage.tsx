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
      <div className={styles['logo-container']}>
        <img src="/RotaCultural.png" alt="Rota Cultural" />
      </div>

      <div className={styles['form-wrapper']}>
        <Form onSubmit={handleSubmit}>
          <Form.Header>Redefinir sua senha</Form.Header>
          
          <Form.Description>
            Insira seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
          </Form.Description>

          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input id="email" type="email" placeholder="seu@email.com" icon={<Mail size={20} />} required />
          </Form.Field>

          <Form.Button className={styles['submit-button']}>Enviar instruções</Form.Button>

          <Form.SignUp prefix="Lembrou a senha?" linkText="Voltar ao login" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} />
        </Form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
