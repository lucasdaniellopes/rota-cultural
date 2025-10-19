import { Mail, Lock, User, Users, Theater } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';
import styles from '../styles/SignupPage.module.css';


function SignupPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'visitor' | 'organizer' | null>(null);

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

          <div className={styles['account-type-container']}>
            <label className={styles['account-type-label']}>Tipo de Conta</label>
            <div className={styles['account-type-options']}>
              <button
                type="button"
                className={`${styles['account-type-btn']} ${accountType === 'visitor' ? styles.active : ''}`}
                onClick={() => setAccountType('visitor')}
                title="Explorar pontos turísticos, eventos e criar roteiros"
              >
                <Users size={24} className={styles['account-icon']} />
                <span className={styles['account-label']}>Visitante</span>
              </button>
              <button
                type="button"
                className={`${styles['account-type-btn']} ${accountType === 'organizer' ? styles.active : ''}`}
                onClick={() => setAccountType('organizer')}
                title="Criar e gerenciar eventos culturais"
              >
                <Theater size={24} className={styles['account-icon']} />
                <span className={styles['account-label']}>Organizador</span>
              </button>
            </div>
          </div>

          <Form.Button className={styles['submit-button']}>Cadastrar</Form.Button>

          <Form.SignUp prefix="Já possui uma conta?" linkText="Fazer login" href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} />
        </Form>
      </div>
    </div>
  );
}

export default SignupPage;
