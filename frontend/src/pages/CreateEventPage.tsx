import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Save, XCircle, Image, AlertTriangle, CheckCircle, Accessibility } from 'lucide-react';
import Navbar from '../components/Navbar';
import styles from '../styles/CreateEventPage.module.css';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

function CreateEventPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    price: '',
    accessibility: '',
    image: '',
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  const categories = ['Música', 'Cultural', 'Festas Populares', 'Esportes', 'Teatro', 'Gastronomia'];

  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setImagePreview(base64);
        setFormData({ ...formData, image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.title.trim()) {
      showNotification('O título é obrigatório.', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showNotification('A descrição é obrigatória.', 'error');
      return;
    }
    if (!formData.category) {
      showNotification('Selecione uma categoria.', 'error');
      return;
    }
    if (!formData.date) {
      showNotification('A data é obrigatória.', 'error');
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      showNotification('Os horários são obrigatórios.', 'error');
      return;
    }
    if (!formData.location.trim()) {
      showNotification('O local é obrigatório.', 'error');
      return;
    }
    if (!formData.price.trim()) {
      showNotification('O preço é obrigatório.', 'error');
      return;
    }

    // Simulação de criação
    console.log('Criando evento...', formData);
    showNotification('Evento criado com sucesso!', 'success', 2000);
    
    setTimeout(() => {
      navigate('/eventos');
    }, 2000);
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar a criação do evento? Os dados não serão salvos.')) {
      navigate('/eventos');
    }
  };

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

      <NotificationComponent />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Novo Evento</h1>
          <p className={styles.subtitle}>Preencha os dados do seu evento cultural</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Upload de Imagem */}
          <div className={styles.imageSection}>
            <label htmlFor="eventImage" className={styles.imageLabel}>
              <div className={styles.imageUploadArea}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                ) : (
                  <div className={styles.imagePlaceholder}>
                    <Image size={48} />
                    <p>Clique para adicionar uma imagem</p>
                    <span>PNG, JPG até 5MB</span>
                  </div>
                )}
              </div>
            </label>
            <input
              id="eventImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.hiddenInput}
            />
          </div>

          {/* Informações Básicas */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Título do Evento *</label>
              <input
                id="title"
                type="text"
                className={styles.input}
                placeholder="Ex: Festival de Música Popular"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição *</label>
              <textarea
                id="description"
                className={styles.textarea}
                placeholder="Descreva seu evento, atrações, programação..."
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Categoria *</label>
              <select
                id="category"
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Data e Horário */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Calendar size={20} />
              Data e Horário
            </h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="date">Data *</label>
                <input
                  id="date"
                  type="date"
                  className={styles.input}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="startTime">Horário de Início *</label>
                <input
                  id="startTime"
                  type="time"
                  className={styles.input}
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="endTime">Horário de Término *</label>
                <input
                  id="endTime"
                  type="time"
                  className={styles.input}
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Local e Preço */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <MapPin size={20} />
              Local e Valores
            </h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="location">Local *</label>
              <input
                id="location"
                type="text"
                className={styles.input}
                placeholder="Ex: Teatro Municipal - Patos, PB"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Preço *</label>
              <input
                id="price"
                type="text"
                className={styles.input}
                placeholder="Ex: R$ 25,00 ou Gratuito"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
          </div>

          {/* Acessibilidade */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Accessibility size={20} />
              Acessibilidade
            </h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="accessibility">Informações de Acessibilidade</label>
              <textarea
                id="accessibility"
                className={styles.textarea}
                placeholder="Descreva os recursos de acessibilidade disponíveis no evento..."
                rows={3}
                value={formData.accessibility}
                onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton} onClick={handleCancel}>
              <XCircle size={18} />
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton}>
              <Save size={18} />
              Criar Evento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
