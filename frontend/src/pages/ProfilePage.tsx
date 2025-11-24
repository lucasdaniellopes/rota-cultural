import styled, { css, keyframes } from 'styled-components';
import {
  Lock,
  Trash2,
  Camera,
  Save,
  User,
  Shield,
  XCircle,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import Navbar from '../components/Navbar';

// --- Light Theme Constants ---
const theme = {
  colors: {
    bg: '#ffffff',         // Fundo branco da página
    surface: '#f9fafb',    // Fundo leve dos cartões
    surfaceHover: '#f3f4f6',
    primary: '#3b82f6',    // Azul
    primaryHover: '#2563eb',
    danger: '#ef4444',
    text: {
      primary: '#1f2937',  // Preto/cinza escuro
      secondary: '#6b7280', // Cinza médio
      muted: '#9ca3af',     // Cinza claro
    },
    border: '#e5e7eb',     // Bordas cinzas claras
    inputBg: '#ffffff',    // Fundo branco dos inputs
  },
  radius: '8px',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// --- Styled Components ---

const Wrapper = styled.div`
  min-height: 100vh;
  background-color: ${theme.colors.bg};
  font-family: 'Inter', sans-serif;
  color: ${theme.colors.text.primary};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

// Cabeçalho do Perfil (Fixo)
const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${theme.colors.border};

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid ${theme.colors.surface};
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const AvatarUploadButton = styled.label`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${theme.colors.primary};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  border: 2px solid ${theme.colors.bg};
  color: white;

  &:hover {
    transform: scale(1.1);
    background-color: ${theme.colors.primaryHover};
  }
`;

const UserInfo = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin: 0;
  }
  p {
    color: ${theme.colors.text.secondary};
    margin-top: 0.25rem;
  }
`;

// Sistema de Abas (Limpeza visual)
const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 5px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: 4px;
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? theme.colors.surface : 'transparent'};
  color: ${props => props.$active ? theme.colors.primary : theme.colors.text.secondary};
  border: 1px solid ${props => props.$active ? theme.colors.border : 'transparent'};
  padding: 0.75rem 1.25rem;
  border-radius: 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$active ? theme.colors.primary : theme.colors.text.primary};
    background: ${props => !props.$active && theme.colors.surfaceHover};
  }
`;

// Área de Conteúdo (Cartão Dark)
const ContentCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radius};
  padding: 2rem;
  animation: ${fadeIn} 0.3s ease-in-out;

  @media (max-width: 600px) {
    padding: 1.5rem;
  }
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${theme.colors.text.primary};
`;

const CardDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
  margin-bottom: 2rem;
`;

// Elementos de Formulário Dark
const FormGroup = styled.div`
  margin-bottom: 1.5rem;

  label {
    display: block;
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
`;

const Input = styled.input`
  width: 100%;
  background-color: ${theme.colors.inputBg};
  border: 1px solid ${theme.colors.border};
  color: ${theme.colors.text.primary};
  padding: 0.875rem 1rem;
  border-radius: ${theme.radius};
  font-size: 0.95rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'outline' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: ${theme.radius};
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  width: 100%;

  @media (min-width: 600px) {
    width: auto;
  }

  ${props => {
    switch (props.$variant) {
      case 'danger':
        return css`
          background-color: rgba(239, 68, 68, 0.1);
          color: ${theme.colors.danger};
          border: 1px solid ${theme.colors.danger};
          &:hover { background-color: rgba(239, 68, 68, 0.2); }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.text.primary};
          border: 1px solid ${theme.colors.border};
          &:hover { background-color: ${theme.colors.surfaceHover}; }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          &:hover { background-color: ${theme.colors.primaryHover}; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

// Notificação Flutuante
const Notification = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #ffffff;
  border-left: 4px solid ${props => props.$type === 'success' ? theme.colors.primary : theme.colors.danger};
  color: ${theme.colors.text.primary};
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 1000;
  animation: ${fadeIn} 0.3s;

  svg {
    color: ${props => props.$type === 'success' ? theme.colors.primary : theme.colors.danger};
  }
`;

// --- Component Logic ---

function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'danger'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // States for forms
  const [formData, setFormData] = useState({
    full_name: '',
    last_name: '',
    email: '',
  });
  const [passData, setPassData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [deleteEmail, setDeleteEmail] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
      });
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const showFeedback = (msg: string, type: 'success' | 'error') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  // Handlers
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarPreview(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append('avatar_upload', file);
      await api.patch('/users/me_update/', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      await refreshUser();
      showFeedback('Foto de perfil atualizada!', 'success');
    } catch (error) {
      showFeedback('Erro ao atualizar foto.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.patch('/users/me_update/', {
        full_name: formData.full_name,
        last_name: formData.last_name,
        email: formData.email !== user?.email ? formData.email : undefined
      });
      await refreshUser();
      showFeedback('Perfil atualizado com sucesso.', 'success');
    } catch (error) {
      showFeedback('Erro ao atualizar perfil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      return showFeedback('As novas senhas não coincidem.', 'error');
    }
    
    setIsLoading(true);
    try {
      await api.post('/users/me_change_password/', {
        current_password: passData.current,
        new_password: passData.new,
        new_password_confirm: passData.confirm
      });
      setPassData({ current: '', new: '', confirm: '' });
      showFeedback('Senha alterada com sucesso.', 'success');
    } catch (error) {
      showFeedback('Erro ao alterar senha. Verifique a senha atual.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteEmail !== user?.email) {
      return showFeedback('E-mail de confirmação incorreto.', 'error');
    }
    if (window.confirm('Tem certeza absoluta? Esta ação é irreversível.')) {
      try {
        await api.delete('/users/me_delete/');
        navigate('/entrar');
      } catch (error) {
        showFeedback('Erro ao deletar conta.', 'error');
      }
    }
  };

  if (!user) return <Wrapper><Navbar /><Container>Carregando...</Container></Wrapper>;

  return (
    <Wrapper>
      <Navbar />
      <Container>
        
        {/* Header Fixo */}
        <ProfileHeader>
          <AvatarWrapper>
            <img src={avatarPreview || "https://via.placeholder.com/150"} alt="Avatar" />
            <AvatarUploadButton htmlFor="avatar-upload">
              <Camera size={16} />
            </AvatarUploadButton>
            <input 
              id="avatar-upload" 
              type="file" 
              hidden 
              accept="image/*"
              onChange={handleAvatarChange} 
            />
          </AvatarWrapper>
          <UserInfo>
            <h1>{user.full_name}</h1>
            <p>{user.email}</p>
          </UserInfo>
        </ProfileHeader>

        {/* Navegação por Abas */}
        <TabsContainer>
          <Tab 
            $active={activeTab === 'general'} 
            onClick={() => setActiveTab('general')}
          >
            <User size={18} /> Dados Pessoais
          </Tab>
          <Tab 
            $active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} /> Segurança
          </Tab>
          <Tab 
            $active={activeTab === 'danger'} 
            onClick={() => setActiveTab('danger')}
          >
            <AlertTriangle size={18} /> Zona de Perigo
          </Tab>
        </TabsContainer>

        {/* Conteúdo da Aba: Geral */}
        {activeTab === 'general' && (
          <ContentCard>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Atualize suas informações pessoais e endereço de e-mail.</CardDescription>
            
            <form onSubmit={handleUpdateProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <label>Nome</label>
                  <Input 
                    value={formData.full_name} 
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Sobrenome</label>
                  <Input 
                    value={formData.last_name} 
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                  />
                </FormGroup>
              </div>
              <FormGroup>
                <label>E-mail</label>
                <Input 
                  type="email"
                  value={formData.email} 
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </FormGroup>

              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  <Save size={18} /> Salvar Alterações
                </Button>
              </ButtonGroup>
            </form>
          </ContentCard>
        )}

        {/* Conteúdo da Aba: Segurança */}
        {activeTab === 'security' && (
          <ContentCard>
            <CardTitle>Alterar Senha</CardTitle>
            <CardDescription>Mantenha sua conta segura usando uma senha forte.</CardDescription>
            
            <form onSubmit={handleUpdatePassword}>
              <FormGroup>
                <label>Senha Atual</label>
                <Input 
                  type="password"
                  placeholder="••••••••"
                  value={passData.current}
                  onChange={e => setPassData({...passData, current: e.target.value})}
                />
              </FormGroup>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <FormGroup>
                  <label>Nova Senha</label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={passData.new}
                    onChange={e => setPassData({...passData, new: e.target.value})}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Confirmar Nova Senha</label>
                  <Input 
                    type="password"
                    placeholder="••••••••"
                    value={passData.confirm}
                    onChange={e => setPassData({...passData, confirm: e.target.value})}
                  />
                </FormGroup>
              </div>

              <ButtonGroup>
                <Button type="submit" disabled={isLoading}>
                  <Lock size={18} /> Atualizar Senha
                </Button>
              </ButtonGroup>
            </form>
          </ContentCard>
        )}

        {/* Conteúdo da Aba: Perigo */}
        {activeTab === 'danger' && (
          <ContentCard style={{ borderColor: theme.colors.danger }}>
            <CardTitle style={{ color: theme.colors.danger }}>Deletar Conta</CardTitle>
            <CardDescription>
              Esta ação irá remover permanentemente todos os seus dados. Digite seu e-mail <strong>({user.email})</strong> para confirmar.
            </CardDescription>
            
            <FormGroup>
              <Input 
                placeholder={user.email}
                value={deleteEmail}
                onChange={e => setDeleteEmail(e.target.value)}
                style={{ borderColor: theme.colors.danger }}
              />
            </FormGroup>

            <ButtonGroup>
              <Button 
                $variant="danger" 
                onClick={handleDeleteAccount}
                disabled={deleteEmail !== user.email || isLoading}
              >
                <Trash2 size={18} /> Excluir Conta Permanentemente
              </Button>
            </ButtonGroup>
          </ContentCard>
        )}

      </Container>

      {/* Feedback Toast */}
      {feedback && (
        <Notification $type={feedback.type}>
          {feedback.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {feedback.msg}
        </Notification>
      )}
    </Wrapper>
  );
}

export default ProfilePage;