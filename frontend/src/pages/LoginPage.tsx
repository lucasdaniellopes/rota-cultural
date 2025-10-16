import { Mail, Lock } from 'lucide-react';
import Form from '../components/Form';
import styles from '../styles/LoginPage.module.css';

function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  return (
    <div className={styles['login-page-container']}>
      <div className={styles['logo-container']}>
        <img src="/RotaCultural.png" alt="Rota Cultural" />
      </div>

      <div className={styles['form-wrapper']}>
        <Form onSubmit={handleSubmit}>
          <Form.Header>Bem-vindo de volta!</Form.Header>
          
          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input id="email" type="email" placeholder="seu@email.com" icon={<Mail size={20} />} required />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.Input id="password" type="password" placeholder="••••••••" icon={<Lock size={20} />} required />
          </Form.Field>

          <Form.ForgotPassword href="/forgot-password">Esqueceu a senha?</Form.ForgotPassword>

          <Form.Button className={styles['submit-button']}>Entrar</Form.Button>

          <Form.SignUp prefix="Não tem uma conta?" linkText="Crie uma" href="/signup" />
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
