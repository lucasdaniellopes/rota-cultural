import {
  Mail,
  Lock,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Edit,
  Save,
  XCircle,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import Navbar from '../components/Navbar';
import styles from '../styles/ProfilePage.module.css';

interface UserProfile {
  name: string;
  email: string;
  joinDate: string;
  avatar: string;
}

// Tipo para as notificações
type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // --- Estados Principais ---
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.first_name || 'Usuário',
    email: user?.email || '',
    joinDate: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('pt-BR') : 'Desconhecido',
    avatar: user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.first_name || 'user')}`,
  });

  const [activeTab, setActiveTab] = useState<'info' | 'email' | 'password' | 'danger'>('info');

  // --- Estado de Notificação ---
  const [notification, setNotification] = useState<Notification | null>(null);

  // --- Estados dos Formulários ---
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editInfoData, setEditInfoData] = useState({ name: profile.name });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [emailData, setEmailData] = useState({ newEmail: '', password: '' });
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // --- Estados de visibilidade de senha ---
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Funções Auxiliares ---

  // Função para exibir notificações
  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // --- Manipuladores de Eventos ---

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setProfile({ ...profile, avatar: base64 });
        showNotification('Avatar atualizado!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfoSave = (e: FormEvent) => {
    e.preventDefault();
    if (!editInfoData.name.trim()) {
      showNotification('O nome não pode ficar em branco.', 'error');
      return;
    }

    const oldName = profile.name;
    const newName = editInfoData.name.trim();
    let newAvatar = profile.avatar;

    // Atualiza o avatar do DiceBear se ainda for o padrão
    const dicebearBaseUrl = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
    if (profile.avatar === `${dicebearBaseUrl}${encodeURIComponent(oldName)}`) {
      newAvatar = `${dicebearBaseUrl}${encodeURIComponent(newName)}`;
    }

    setProfile({
      ...profile,
      name: newName,
      avatar: newAvatar,
    });
    setIsEditingInfo(false);
    showNotification('Perfil atualizado com sucesso!', 'success');
  };

  const handleInfoCancel = () => {
    setEditInfoData({ name: profile.name });
    setIsEditingInfo(false);
  };

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      showNotification('Todos os campos de senha são obrigatórios.', 'error');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      showNotification('As novas senhas não coincidem.', 'error');
      return;
    }
    if (passwordData.new.length < 6) {
      showNotification('A nova senha deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    
    try {
      await api.post('/users/me_change_password/', {
        current_password: passwordData.current,
        new_password: passwordData.new,
        new_password_confirm: passwordData.confirm,
      });
      showNotification('Senha alterada com sucesso!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao alterar senha';
      showNotification(errorMessage, 'error');
    }
  };

  const handleChangeEmail = async () => {
    if (!emailData.newEmail || !emailData.password) {
      showNotification('Todos os campos de e-mail são obrigatórios.', 'error');
      return;
    }
    if (!emailData.newEmail.includes('@')) {
      showNotification('O novo e-mail parece ser inválido.', 'error');
      return;
    }
    
    try {
      await api.patch('/users/me_update/', {
        email: emailData.newEmail,
      });
      await refreshUser();
      showNotification('E-mail alterado com sucesso!', 'success');
      setEmailData({ newEmail: '', password: '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao alterar e-mail';
      showNotification(errorMessage, 'error');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== profile.email) {
      showNotification('O e-mail digitado não corresponde ao seu e-mail.', 'error');
      return;
    }
    if (window.confirm('Tem certeza? Esta ação é permanente e não pode ser desfeita.')) {
      try {
        await api.delete('/users/me_delete/');
        showNotification('Conta deletada com sucesso.', 'success');
        setTimeout(() => {
          navigate('/entrar');
        }, 2000);
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || 'Falha ao deletar conta';
        showNotification(errorMessage, 'error');
      }
    }
  };

  // Efeito para resetar o formulário de edição ao trocar de aba
  useEffect(() => {
    if (activeTab !== 'info') {
      setIsEditingInfo(false);
      setEditInfoData({ name: profile.name });
    }
  }, [activeTab, profile.name]);


  // Componente de Notificação
  const NotificationComponent = () => {
    if (!notification) return null;

    const icon = {
      success: <CheckCircle size={20} />,
      error: <AlertTriangle size={20} />,
      info: <AlertTriangle size={20} />,
    }[notification.type];

    return (
      <div className={`${styles.notification} ${styles[notification.type]}`}>
        {icon}
        <span>{notification.message}</span>
        <button className={styles.notificationClose} onClick={() => setNotification(null)}>
          <XCircle size={18} />
        </button>
      </div>
    );
  };


  return (
    <div className={styles.wrapper}>
      <Navbar isAuthenticated={true} />

      {/* Container de Notificação */}
      <NotificationComponent />

      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Cabeçalho */}
          <div className={styles.header}>
            <h1 className={styles.title}>Minha Conta</h1>
            <p className={styles.subtitle}>Gerencie suas informações de perfil e preferências de segurança</p>
          </div>

          {/* Seção de Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.avatarContainer}>
              <img src={profile.avatar} alt="Avatar do perfil" className={styles.avatar} />
              <label htmlFor="avatarInput" className={styles.avatarUploadButton}>
                <Camera size={20} />
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.hiddenInput}
              />
            </div>
            <div>
              <h2 className={styles.avatarName}>{profile.name}</h2>
              <p className={styles.avatarEmail}>{profile.email}</p>
            </div>
          </div>

          {/* Abas */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'info' ? styles.active : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Informações
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'email' ? styles.active : ''}`}
              onClick={() => setActiveTab('email')}
            >
              E-mail
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Senha
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'danger' ? styles.active : ''}`}
              onClick={() => setActiveTab('danger')}
            >
              Perigo
            </button>
          </div>

          {/* Conteúdo das Abas */}
          <div className={styles.tabContent}>
            {/* Aba: Informações */}
            {activeTab === 'info' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>Informações do Perfil</h2>
                  {!isEditingInfo && (
                    <button className={styles.editButton} onClick={() => setIsEditingInfo(true)}>
                      <Edit size={16} />
                      Editar
                    </button>
                  )}
                </div>

                {!isEditingInfo ? (
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Nome Completo</label>
                      <p className={styles.infoValue}>{profile.name}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>E-mail</label>
                      <p className={styles.infoValue}>{profile.email}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Membro desde</label>
                      <p className={styles.infoValue}>{profile.joinDate}</p>
                    </div>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleInfoSave}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fullName">Nome Completo</label>
                      <input
                        id="fullName"
                        type="text"
                        className={styles.input}
                        value={editInfoData.name}
                        onChange={(e) => setEditInfoData({ ...editInfoData, name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button type="button" className={styles.secondaryButton} onClick={handleInfoCancel}>
                        <XCircle size={18} />
                        Cancelar
                      </button>
                      <button type="submit" className={styles.primaryButton}>
                        <Save size={18} />
                        Salvar
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Aba: E-mail */}
            {activeTab === 'email' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Alterar E-mail</h2>
                <p className={styles.sectionDescription}>E-mail atual: <strong>{profile.email}</strong></p>
                
                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleChangeEmail(); }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="newEmail">Novo E-mail</label>
                    <input
                      id="newEmail"
                      type="email"
                      className={styles.input}
                      placeholder="seu.novo@email.com"
                      value={emailData.newEmail}
                      onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="emailPassword">Sua Senha</label>
                    <input
                      id="emailPassword"
                      type="password"
                      className={styles.input}
                      placeholder="••••••••"
                      value={emailData.password}
                      onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    />
                  </div>
                  <button type="submit" className={styles.primaryButton}>
                    <Mail size={18} />
                    Alterar E-mail
                  </button>
                </form>
              </div>
            )}

            {/* Aba: Senha */}
            {activeTab === 'password' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Alterar Senha</h2>
                <p className={styles.sectionDescription}>Escolha uma senha forte com pelo menos 6 caracteres</p>
                
                <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Senha Atual</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        className={styles.input}
                        placeholder="••••••••"
                        value={passwordData.current}
                        onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Mostrar/Ocultar senha"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">Nova Senha</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        className={styles.input}
                        placeholder="••••••••"
                        value={passwordData.new}
                        onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label="Mostrar/Ocultar nova senha"
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
                    <div className={styles.passwordWrapper}>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={styles.input}
                        placeholder="••••••••"
                        value={passwordData.confirm}
                        onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Mostrar/Ocultar confirmação de senha"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryButton}>
                    <Lock size={18} />
                    Alterar Senha
                  </button>
                </form>
              </div>
            )}

            {/* Aba: Perigo */}
            {activeTab === 'danger' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Zona de Perigo</h2>
                <p className={styles.sectionDescription}>Ações irreversíveis na sua conta</p>
                
                <div className={styles.dangerZone}>
                  <div className={styles.dangerCard}>
                    <h3 className={styles.dangerTitle}>Deletar Conta</h3>
                    <p className={styles.dangerDescription}>
                      Ao deletar sua conta, todos os seus dados serão permanentemente removidos e esta ação não pode ser desfeita.
                    </p>
                    
                    <form className={styles.form} onSubmit={(e) => { e.preventDefault(); handleDeleteAccount(); }}>
                      <div className={styles.formGroup}>
                        <label htmlFor="deleteConfirm">
                          Digite seu e-mail para confirmar: <strong>{profile.email}</strong>
                        </label>
                        <input
                          id="deleteConfirm"
                          type="text"
                          className={styles.input}
                          placeholder={profile.email}
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.dangerButton}
                        disabled={deleteConfirm !== profile.email}
                      >
                        <Trash2 size={18} />
                        Deletar Minha Conta
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;