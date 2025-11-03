import { Mail, Lock, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from '@/components/Form';
import styles from '@/styles/SignupPage.module.css';

function SignupPage() {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'visitor' | 'organizer' | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Signup form submitted');
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
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.67 14 5 15.17 5 17.5V20H19V17.5C19 15.17 14.33 14 12 14Z" fill="#667eea" stroke="#667eea" strokeWidth="1.5"/>
              </svg>
              <span className={styles['feature-text']}>Perfil Personalizado</span>
            </div>
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
            
            <Form.Field>
              <Form.Label htmlFor="fullname">Nome completo</Form.Label>
              <Form.Input 
                id="fullname" 
                type="text" 
                placeholder="Seu nome completo" 
                icon={<User size={20} />} 
                required 
              />
            </Form.Field>

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

            <Form.Field>
              <Form.Label htmlFor="confirm-password">Confirmar senha</Form.Label>
              <Form.Input 
                id="confirm-password" 
                type="password" 
                placeholder="••••••••" 
                icon={<Lock size={20} />} 
                required 
              />
            </Form.Field>

            <div className={styles['account-type-container']}>
              <label className={styles['account-type-label']}>Tipo de Conta</label>
              <div className={styles['account-type-options']}>
                <button
                  type="button"
                  className={`${styles['account-type-btn']} ${accountType === 'visitor' ? styles.active : ''}`}
                  onClick={() => setAccountType('visitor')}
                  title="Explorar pontos turísticos e eventos culturais"
                >
                  <span className={styles['account-label']}>Visitante</span>
                </button>
                <button
                  type="button"
                  className={`${styles['account-type-btn']} ${accountType === 'organizer' ? styles.active : ''}`}
                  onClick={() => setAccountType('organizer')}
                  title="Criar e gerenciar eventos culturais"
                >
                  <span className={styles['account-label']}>Organizador</span>
                </button>
              </div>
            </div>

            <Form.Button className={styles['submit-button']}>Cadastrar</Form.Button>

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
