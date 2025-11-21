import { useState, useEffect, type FormEvent, type ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Save, XCircle, AlertTriangle, CheckCircle, Accessibility, Image as ImageIcon, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import { eventsService, type Category, type CreateEventData } from '@/services/events';
import { geocodingService, type NominatimResult } from '@/services/geocoding';
import { useAuth } from '@/contexts/AuthContext';
import styles from '../styles/CreateEventPage.module.css';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  message: string;
  type: NotificationType;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name: string;
}

// Categorias pré-definidas caso a API não retorne
const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Música', item_type: 'event' },
  { id: 2, name: 'Teatro', item_type: 'event' },
  { id: 3, name: 'Dança', item_type: 'event' },
  { id: 4, name: 'Cinema', item_type: 'event' },
  { id: 5, name: 'Artes Visuais', item_type: 'event' },
  { id: 6, name: 'Literatura', item_type: 'event' },
  { id: 7, name: 'Gastronomia', item_type: 'event' },
  { id: 8, name: 'Festival', item_type: 'event' },
  { id: 9, name: 'Exposição', item_type: 'event' },
  { id: 10, name: 'Workshop', item_type: 'event' },
];

function CreateEventPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSearchResults, setLocationSearchResults] = useState<NominatimResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    price: '',
    accessibility: '',
    content_type: '7', // ContentType ID para locations.location
    object_id: '1', // Default, será atualizado com localização real
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    loadCategories();
  }, [isAuthenticated, navigate]);

  const loadCategories = async () => {
    try {
      const data = await eventsService.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
      // Se falhar ou retornar vazio, mantém as categorias pré-definidas
    } catch (err) {
      // Silenciosamente mantém as categorias pré-definidas
      console.warn('Usando categorias pré-definidas');
    }
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    setShowLocationDropdown(true);
    
    if (query.trim().length < 2) {
      setLocationSearchResults([]);
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      return;
    }

    // Limpar timeout anterior se existir
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Definir novo timeout com debounce de 500ms
    debounceTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await geocodingService.search(query, 10, ['br']);
        setLocationSearchResults(results);
      } catch (err) {
        console.error('Error searching locations:', err);
        showNotification('Erro ao buscar localizações', 'error');
        setLocationSearchResults([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500); // Aguarda 500ms após o último caractere digitado
  };

  const handleLocationSelect = (result: NominatimResult) => {
    const location: LocationCoordinates = {
      name: result.name || result.display_name.split(',')[0].trim(),
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
    };
    setSelectedLocation(location);
    setLocationSearch(location.name);
    setLocationSearchResults([]);
    setShowLocationDropdown(false);
  };

  // Cleanup do debounce ao desmontar componente
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showNotification('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)', 'error');
      return;
    }

    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification('A imagem deve ter no máximo 5MB', 'error');
      return;
    }

    setImageFile(file);
    
    // Criar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, duration);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.name.trim()) {
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
    if (!formData.start_date) {
      showNotification('A data de início é obrigatória.', 'error');
      return;
    }
    if (!formData.end_date) {
      showNotification('A data de término é obrigatória.', 'error');
      return;
    }
    if (!formData.start_time || !formData.end_time) {
      showNotification('Os horários são obrigatórios.', 'error');
      return;
    }
    if (!formData.price.trim()) {
      showNotification('O preço é obrigatório (use 0 para gratuito).', 'error');
      return;
    }
    if (!selectedLocation) {
      showNotification('Selecione uma localização para o evento.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // Combinar data e hora para criar datetime completo (ISO 8601)
      const startDateTime = `${formData.start_date}T${formData.start_time}:00`;
      const endDateTime = `${formData.end_date}T${formData.end_time}:00`;

      // Converter time strings para Time format (HH:MM:SS)
      const startTimeFormatted = `${formData.start_time}:00`;
      const endTimeFormatted = `${formData.end_time}:00`;

      // Usar FormData para enviar arquivo de imagem
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('start_date', startDateTime);
      formDataToSend.append('end_date', endDateTime);
      formDataToSend.append('start_time', startTimeFormatted);
      formDataToSend.append('end_time', endTimeFormatted);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('accessibility', formData.accessibility);
      
      // Enviar coordenadas se localização foi selecionada
      if (selectedLocation) {
        formDataToSend.append('location_name_input', selectedLocation.name);
        formDataToSend.append('latitude', String(selectedLocation.latitude));
        formDataToSend.append('longitude', String(selectedLocation.longitude));
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      console.log('Sending event data...');
      await eventsService.createEvent(formDataToSend as any);
      showNotification('Evento criado com sucesso!', 'success', 2000);
      
      setTimeout(() => {
        navigate('/eventos');
      }, 2000);
    } catch (err: any) {
      console.error('Event creation error:', err);
      console.error('Response:', err.response?.data);
      const errorMessage = err.response?.data?.detail || 
                          err.response?.data?.non_field_errors?.[0] ||
                          err.response?.data?.name?.[0] ||
                          err.response?.data?.description?.[0] ||
                          err.response?.data?.category?.[0] ||
                          'Erro ao criar evento. Tente novamente.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
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
      <Navbar />

      <NotificationComponent />

      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Criar Novo Evento</h1>
          <p className={styles.subtitle}>Preencha os dados do seu evento cultural</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Capa do Evento */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <ImageIcon size={20} />
              Capa do Evento
            </h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="image">Imagem de Capa</label>
              {imagePreview ? (
                <div className={styles.imagePreviewContainer}>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={removeImage}
                    disabled={isLoading}
                  >
                    <XCircle size={18} />
                    Remover Imagem
                  </button>
                </div>
              ) : (
                <div className={styles.uploadBox}>
                  <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageChange}
                    disabled={isLoading}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="image" className={styles.uploadLabel}>
                    <ImageIcon size={32} />
                    <span>Clique para selecionar uma imagem</span>
                    <small>JPEG, PNG ou WebP (máximo 5MB)</small>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Informações Básicas */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Informações Básicas</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Título do Evento *</label>
              <input
                id="name"
                type="text"
                className={styles.input}
                placeholder="Ex: Festival de Música Popular"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">Categoria *</label>
              <select
                id="category"
                className={styles.select}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={isLoading}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
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
                <label htmlFor="start_date">Data de Início *</label>
                <input
                  id="start_date"
                  type="date"
                  className={styles.input}
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="end_date">Data de Término *</label>
                <input
                  id="end_date"
                  type="date"
                  className={styles.input}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="start_time">Horário de Início *</label>
                <input
                  id="start_time"
                  type="time"
                  className={styles.input}
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="end_time">Horário de Término *</label>
                <input
                  id="end_time"
                  type="time"
                  className={styles.input}
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  disabled={isLoading}
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
              <label htmlFor="location-search">Local do Evento *</label>
              <div className={styles.searchInputContainer}>
                <div className={styles.searchInput}>
                  <Search size={18} className={styles.searchIcon} />
                  <input
                    id="location-search"
                    type="text"
                    placeholder="Busque por endereço, local ou bairro..."
                    value={locationSearch}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    onFocus={() => locationSearch.length >= 2 && setShowLocationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                    disabled={isLoading}
                    className={styles.input}
                    autoComplete="off"
                  />
                </div>
                
                {selectedLocation && (
                  <div className={styles.selectedLocation}>
                    <span>✓ {selectedLocation.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null);
                        setLocationSearch('');
                      }}
                      disabled={isLoading}
                      className={styles.clearLocationButton}
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )}

                {showLocationDropdown && locationSearchResults.length > 0 && (
                  <div className={styles.locationDropdown}>
                    {isSearchingLocation ? (
                      <div className={styles.dropdownItem}>Buscando...</div>
                    ) : (
                      locationSearchResults.map((result) => (
                        <button
                          key={result.place_id}
                          type="button"
                          className={styles.dropdownItem}
                          onClick={() => handleLocationSelect(result)}
                        >
                          <MapPin size={14} />
                          <div>
                            <div className={styles.dropdownTitle}>
                              {result.name || result.display_name.split(',')[0].trim()}
                            </div>
                            <div className={styles.dropdownSubtitle}>
                              {result.display_name.split(',').slice(1, 3).join(', ')}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price">Preço (R$) *</label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                className={styles.input}
                placeholder="0.00 para eventos gratuitos"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                disabled={isLoading}
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
              <label htmlFor="accessibility">Recursos de Acessibilidade</label>
              <textarea
                id="accessibility"
                className={styles.textarea}
                placeholder="Ex: Rampas de acesso, intérprete de libras, audiodescrição..."
                rows={3}
                value={formData.accessibility}
                onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isLoading}
            >
              <XCircle size={18} />
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              <Save size={18} />
              {isLoading ? 'Criando...' : 'Criar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventPage;
