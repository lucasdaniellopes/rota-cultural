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
  Upload,
} from 'lucide-react';
import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import Navbar from '../components/Navbar';
import styles from '../styles/ProfilePage.module.css';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // --- Estados Principais ---
  const [activeTab, setActiveTab] = useState<'info' | 'email' | 'password' | 'danger'>('info');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Estados dos Formulários ---
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editInfoData, setEditInfoData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
  });
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [emailData, setEmailData] = useState({ newEmail: '' });
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // --- Estados de visibilidade de senha ---
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Atualizar dados do formulário quando o usuário mudar
  useEffect(() => {
    if (user) {
      setEditInfoData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
      setAvatarPreview(user.avatar || null);
      setEmailData({ newEmail: user.email || '' });
    }
  }, [user]);

  // --- Funções Auxiliares ---

  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  // --- Manipuladores de Avatar ---

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecione uma imagem válida', 'error');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showNotification('A imagem deve ter no máximo 5MB', 'error');
        return;
      }

      setAvatarFile(file);

      // Mostrar preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      showNotification('Selecione uma imagem primeiro', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      await api.patch('/users/me_update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setAvatarFile(null);
      await refreshUser();
      showNotification('Avatar atualizado com sucesso!', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao atualizar avatar';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Manipuladores de Informações ---

  const handleInfoSave = async (e: FormEvent) => {
    e.preventDefault();

    if (!editInfoData.first_name.trim()) {
      showNotification('Nome é obrigatório', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch('/users/me_update/', {
        first_name: editInfoData.first_name,
        last_name: editInfoData.last_name,
      });

      await refreshUser();
      setIsEditingInfo(false);
      showNotification('Perfil atualizado com sucesso!', 'success');
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao atualizar perfil';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoCancel = () => {
    if (user) {
      setEditInfoData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      });
    }
    setIsEditingInfo(false);
  };

  // --- Manipuladores de Email ---

  const handleChangeEmail = async () => {
    if (!emailData.newEmail) {
      showNotification('E-mail é obrigatório', 'error');
      return;
    }

    if (!emailData.newEmail.includes('@')) {
      showNotification('E-mail inválido', 'error');
      return;
    }

    if (emailData.newEmail === user?.email) {
      showNotification('O novo e-mail deve ser diferente do atual', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.patch('/users/me_update/', {
        email: emailData.newEmail,
      });

      await refreshUser();
      showNotification('E-mail alterado com sucesso!', 'success');
      setEmailData({ newEmail: user?.email || '' });
    } catch (err: any) {
      const errorMessage = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Falha ao alterar e-mail';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Manipuladores de Senha ---

  const handleChangePassword = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      showNotification('Todos os campos de senha são obrigatórios', 'error');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      showNotification('As novas senhas não coincidem', 'error');
      return;
    }

    if (passwordData.new.length < 8) {
      showNotification('A nova senha deve ter no mínimo 8 caracteres', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/users/me_change_password/', {
        current_password: passwordData.current,
        new_password: passwordData.new,
        new_password_confirm: passwordData.confirm,
      });

      showNotification('Senha alterada com sucesso!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.current_password?.[0] ||
        'Falha ao alterar senha';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Manipuladores de Deleção ---

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user?.email) {
      showNotification('E-mail digitado não corresponde ao seu e-mail', 'error');
      return;
    }

    if (!window.confirm('Tem certeza? Esta ação é permanente e não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete('/users/me_delete/');
      showNotification('Conta deletada. Redirecionando...', 'success');
      setTimeout(() => {
        navigate('/entrar');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Falha ao deletar conta';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Resetar formulário ao trocar aba ---
  useEffect(() => {
    if (activeTab !== 'info') {
      setIsEditingInfo(false);
      if (user) {
        setEditInfoData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
        });
      }
    }
  }, [activeTab, user]);

  // --- Componente de Notificação ---
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

  if (!user) {
    return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Carregando perfil...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Navbar />

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
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar do perfil" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <Camera size={40} />
                </div>
              )}
              <label htmlFor="avatarInput" className={styles.avatarUploadButton}>
                <Camera size={20} />
              </label>
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.hiddenInput}
                disabled={isLoading}
              />
            </div>
            <div>
              <h2 className={styles.avatarName}>
                {user.first_name} {user.last_name}
              </h2>
              <p className={styles.avatarEmail}>{user.email}</p>
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={isLoading}
                  className={styles.uploadButton}
                >
                  <Upload size={16} />
                  Enviar Avatar
                </button>
              )}
            </div>
          </div>

          {/* Abas */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'info' ? styles.active : ''}`}
              onClick={() => setActiveTab('info')}
              disabled={isLoading}
            >
              Informações
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'email' ? styles.active : ''}`}
              onClick={() => setActiveTab('email')}
              disabled={isLoading}
            >
              E-mail
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'password' ? styles.active : ''}`}
              onClick={() => setActiveTab('password')}
              disabled={isLoading}
            >
              Senha
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'danger' ? styles.active : ''}`}
              onClick={() => setActiveTab('danger')}
              disabled={isLoading}
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
                    <button
                      className={styles.editButton}
                      onClick={() => setIsEditingInfo(true)}
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                  )}
                </div>

                {!isEditingInfo ? (
                  <div className={styles.infoGrid}>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Nome</label>
                      <p className={styles.infoValue}>{user.first_name}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Sobrenome</label>
                      <p className={styles.infoValue}>{user.last_name || '—'}</p>
                    </div>
                    <div className={styles.infoItem}>
                      <label className={styles.infoLabel}>Membro desde</label>
                      <p className={styles.infoValue}>
                        {new Date(user.date_joined).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={handleInfoSave}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">Nome</label>
                      <input
                        id="firstName"
                        type="text"
                        className={styles.input}
                        value={editInfoData.first_name}
                        onChange={(e) =>
                          setEditInfoData({ ...editInfoData, first_name: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">Sobrenome</label>
                      <input
                        id="lastName"
                        type="text"
                        className={styles.input}
                        value={editInfoData.last_name}
                        onChange={(e) =>
                          setEditInfoData({ ...editInfoData, last_name: e.target.value })
                        }
                        disabled={isLoading}
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={handleInfoCancel}
                        disabled={isLoading}
                      >
                        <XCircle size={18} />
                        Cancelar
                      </button>
                      <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                        <Save size={18} />
                        {isLoading ? 'Salvando...' : 'Salvar'}
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
                <p className={styles.sectionDescription}>
                  E-mail atual: <strong>{user.email}</strong>
                </p>

                <form
                  className={styles.form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangeEmail();
                  }}
                >
                  <div className={styles.formGroup}>
                    <label htmlFor="newEmail">Novo E-mail</label>
                    <input
                      id="newEmail"
                      type="email"
                      className={styles.input}
                      placeholder="seu.novo@email.com"
                      value={emailData.newEmail}
                      onChange={(e) => setEmailData({ newEmail: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                    <Mail size={18} />
                    {isLoading ? 'Alterando...' : 'Alterar E-mail'}
                  </button>
                </form>
              </div>
            )}

            {/* Aba: Senha */}
            {activeTab === 'password' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Alterar Senha</h2>
                <p className={styles.sectionDescription}>
                  Escolha uma senha forte com pelo menos 8 caracteres
                </p>

                <form
                  className={styles.form}
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleChangePassword();
                  }}
                >
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
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Mostrar/Ocultar senha"
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        aria-label="Mostrar/Ocultar nova senha"
                        disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label="Mostrar/Ocultar confirmação de senha"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className={styles.primaryButton} disabled={isLoading}>
                    <Lock size={18} />
                    {isLoading ? 'Alterando...' : 'Alterar Senha'}
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
                      Ao deletar sua conta, todos os seus dados serão permanentemente removidos e
                      esta ação não pode ser desfeita.
                    </p>

                    <form
                      className={styles.form}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleDeleteAccount();
                      }}
                    >
                      <div className={styles.formGroup}>
                        <label htmlFor="deleteConfirm">
                          Digite seu e-mail para confirmar: <strong>{user.email}</strong>
                        </label>
                        <input
                          id="deleteConfirm"
                          type="text"
                          className={styles.input}
                          placeholder={user.email}
                          value={deleteConfirm}
                          onChange={(e) => setDeleteConfirm(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>

                      <button
                        type="submit"
                        className={styles.dangerButton}
                        disabled={deleteConfirm !== user.email || isLoading}
                      >
                        <Trash2 size={18} />
                        {isLoading ? 'Deletando...' : 'Deletar Minha Conta'}
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
