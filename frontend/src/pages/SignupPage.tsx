import { Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import styles from '../styles/SignupPage.module.css';

function SignupPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Signup form submitted');
  };

  return (
    <div className={styles['signup-page-container']}>
      <div className={styles['logo-container']}>
        <img src="/RotaCultural.png" alt="Rota Cultural" />
      </div>

      <div className={styles['form-wrapper']}>
        <Form onSubmit={handleSubmit}>
          <Form.Header>Criar sua conta</Form.Header>
          
          <Form.Field>
            <Form.Label htmlFor="fullname">Nome completo</Form.Label>
            <Form.Input id="fullname" type="text" placeholder="Seu nome completo" icon={<User size={20} />} required />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Input id="email" type="email" placeholder="seu@email.com" icon={<Mail size={20} />} required />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="password">Senha</Form.Label>
            <Form.Input id="password" type="password" placeholder="••••••••" icon={<Lock size={20} />} required />
          </Form.Field>

          <Form.Field>
            <Form.Label htmlFor="confirm-password">Confirmar senha</Form.Label>
            <Form.Input id="confirm-password" type="password" placeholder="••••••••" icon={<Lock size={20} />} required />
          </Form.Field>

          <Form.Button className={styles['submit-button']}>Cadastrar</Form.Button>

          <Form.SignUp prefix="Já possui uma conta?" linkText="Fazer login" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} />
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
