import styled, { css, keyframes } from 'styled-components';
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Save, XCircle, AlertTriangle, CheckCircle, Accessibility, Image as ImageIcon, Search, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { eventsService, type Category as EventCategory } from '@/services/events';
import { placesService, type Category as PlaceCategory } from '@/services/places';
import { geocodingService, type NominatimResult } from '@/services/geocoding';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---
type ItemType = 'event' | 'place';
type Category = EventCategory | PlaceCategory;

interface CreateItemPageProps {
  type: ItemType;
}

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name: string;
}

type NotificationType = 'success' | 'error' | 'info';

// --- Animations ---
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8f8f8;
  font-family: 'Inter', sans-serif;
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem;

  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) { font-size: 1.75rem; }
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #666666;
  margin: 0;

  @media (max-width: 480px) { font-size: 0.9rem; }
`;

const Form = styled.form`
  background-color: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) { padding: 1.5rem; }
  @media (max-width: 480px) { padding: 1rem; gap: 1.5rem; }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) { font-size: 1.1rem; }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const InputBase = css`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  color: #1a1a1a;
  background-color: #ffffff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #141414;
    box-shadow: 0 0 0 3px rgba(20, 20, 20, 0.1);
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  ${InputBase}
`;

const Select = styled.select`
  ${InputBase}
  cursor: pointer;
`;

const TextArea = styled.textarea`
  ${InputBase}
  resize: vertical;
  min-height: 100px;
  font-family: 'Inter', sans-serif;
`;

// --- Upload Components ---

const UploadBox = styled.div`
  width: 100%;
  height: 250px;
  border: 2px dashed #cccccc;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: #141414;
    background-color: #f0f0f0;
  }

  @media (max-width: 480px) { height: 200px; }
`;

const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  color: #666666;
  text-align: center;
  cursor: pointer;
  padding: 2rem;
  width: 100%;
  height: 100%;
  justify-content: center;

  span {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a1a;
  }

  small {
    font-size: 0.875rem;
    color: #999999;
  }
`;

const ImagePreviewContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 0.5rem;
  display: block;
`;

const RemoveImageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f44336;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover { background-color: #d32f2f; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

// --- Location Search Components ---

const SearchInputContainer = styled.div`
  position: relative;
  z-index: 5;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;

  svg {
    position: absolute;
    left: 0.75rem;
    color: #999999;
    pointer-events: none;
    z-index: 1;
  }

  input {
    padding-left: 2.5rem;
  }
`;

const SelectedLocation = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin-top: 0.5rem;
  background-color: #e8f5e9;
  border: 1px solid #4caf50;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  color: #2e7d32;
`;

const ClearLocationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: #2e7d32;
  transition: color 0.2s ease;

  &:hover { color: #1b5e20; }
`;

const LocationDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #cccccc;
  border-top: none;
  border-radius: 0 0 0.375rem 0.375rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: -1px;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: #f1f1f1; }
  &::-webkit-scrollbar-thumb { background: #cccccc; border-radius: 3px; }
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.95rem;
  color: #1a1a1a;

  &:hover { background-color: #f8f8f8; }
  &:last-child { border-bottom: none; }
`;

// --- Action Buttons ---

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;

  @media (max-width: 768px) { flex-direction: column-reverse; }
`;

const Button = styled.button<{ $variant?: 'primary' | 'outline' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${props => props.$variant === 'outline' ? css`
    background-color: transparent;
    color: #666666;
    border: 2px solid #cccccc;
    &:hover {
      border-color: #999999;
      color: #1a1a1a;
      background-color: #f8f8f8;
    }
    &:active { transform: scale(0.98); }
  ` : css`
    background-color: #141414;
    color: #ffffff;
    border: none;
    &:hover {
      background-color: #000000;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    &:active { transform: translateY(0); }
  `}

  @media (max-width: 768px) { width: 100%; }
`;

// --- Notification ---

const Notification = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 80px;
  right: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: ${slideIn} 0.3s ease;
  max-width: 400px;
  
  border-left: 4px solid ${props =>
    props.$type === 'success' ? '#4caf50' :
      props.$type === 'error' ? '#f44336' : '#2196f3'};

  svg {
    color: ${props =>
    props.$type === 'success' ? '#4caf50' :
      props.$type === 'error' ? '#f44336' : '#2196f3'};
  }

  @media (max-width: 480px) {
    top: 70px;
    right: 0.5rem;
    left: 0.5rem;
    max-width: none;
  }
`;

const NotificationClose = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  color: #666666;
  &:hover { color: #1a1a1a; }
`;

// --- Default Categories ---

const DEFAULT_EVENT_CATEGORIES: EventCategory[] = [
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

const DEFAULT_PLACE_CATEGORIES: PlaceCategory[] = [
  { id: 1, name: 'Religioso', item_type: 'place' },
  { id: 2, name: 'Cultural', item_type: 'place' },
  { id: 3, name: 'Histórico', item_type: 'place' },
  { id: 4, name: 'Natureza', item_type: 'place' },
  { id: 5, name: 'Comércio', item_type: 'place' },
  { id: 6, name: 'Lazer', item_type: 'place' },
  { id: 7, name: 'Gastronomia', item_type: 'place' },
  { id: 8, name: 'Museu', item_type: 'place' },
];

function CreateItemPage({ type }: CreateItemPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = useState<{ message: string, type: NotificationType } | null>(null);
  const [categories, setCategories] = useState<Category[]>(
    type === 'event' ? DEFAULT_EVENT_CATEGORIES : DEFAULT_PLACE_CATEGORIES
  );
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationCoordinates | null>(null);
  const [locationSearch, setLocationSearch] = useState('');
  const [locationSearchResults, setLocationSearchResults] = useState<NominatimResult[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration based on type
  const config = type === 'event' ? {
    title: 'Criar Novo Evento',
    subtitle: 'Preencha os dados do seu evento cultural',
    returnPath: '/eventos',
    successMessage: 'Evento criado com sucesso!',
    labels: {
      name: 'Título do Evento',
      namePlaceholder: 'Ex: Festival de Música Popular',
      image: 'Capa do Evento',
      location: 'Local do Evento'
    },
    fields: {
      hasDateRange: true,
      hasTimeRange: true,
      hasPrice: true,
      hasOpeningHours: false
    }
  } : {
    title: 'Criar Novo Ponto Turístico',
    subtitle: 'Preencha os dados do ponto turístico',
    returnPath: '/pontos-turisticos',
    successMessage: 'Ponto turístico criado com sucesso!',
    labels: {
      name: 'Nome do Local',
      namePlaceholder: 'Ex: Igreja Nossa Senhora da Conceição',
      image: 'Imagem do Local',
      location: 'Localização'
    },
    fields: {
      hasDateRange: false,
      hasTimeRange: false,
      hasPrice: false,
      hasOpeningHours: true
    }
  };

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    accessibility: '',
    // Event specific
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    price: '',
    // Place specific
    opening_time: '',
    closing_time: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    loadCategories();
    // Reset form when type changes
    setFormData(prev => ({
      ...prev,
      name: '',
      description: '',
      category: '',
      accessibility: '',
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      price: '',
      opening_time: '',
      closing_time: '',
    }));
    setSelectedLocation(null);
    setLocationSearch('');
    setImageFile(null);
    setImagePreview('');
  }, [isAuthenticated, navigate, type]);

  const loadCategories = async () => {
    try {
      const data = type === 'event'
        ? await eventsService.getCategories()
        : await placesService.getCategories();

      if (data && data.length > 0) setCategories(data);
    } catch (err) {
      console.warn('Erro ao carregar categorias');
    }
  };

  const handleLocationSearch = async (query: string) => {
    setLocationSearch(query);
    setShowLocationDropdown(true);

    if (query.trim().length < 2) {
      setLocationSearchResults([]);
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      return;
    }

    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = setTimeout(async () => {
      setIsSearchingLocation(true);
      try {
        const results = await geocodingService.search(query, 10, ['br']);
        // Filter results to Patos, PB (city or town matches "Patos")
        const filtered = results.filter((result) => {
          const city = result.address.city || result.address.town || '';
          return city.toLowerCase().includes('patos');
        });
        setLocationSearchResults(filtered);
      } catch (err) {
        showNotification('Erro ao buscar localizações', 'error');
        setLocationSearchResults([]);
      } finally {
        setIsSearchingLocation(false);
      }
    }, 500);
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

  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      showNotification('Por favor, selecione uma imagem válida (JPEG, PNG ou WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showNotification('A imagem deve ter no máximo 5MB', 'error');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const showNotification = (message: string, type: NotificationType = 'info', duration: number = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Common validations
    if (!formData.name.trim()) return showNotification('O nome/título é obrigatório.', 'error');
    if (!formData.description.trim()) return showNotification('A descrição é obrigatória.', 'error');
    if (!formData.category) return showNotification('Selecione uma categoria.', 'error');
    if (!selectedLocation) return showNotification('Selecione uma localização.', 'error');

    // Type specific validations
    if (type === 'event') {
      if (!formData.start_date) return showNotification('A data de início é obrigatória.', 'error');
      if (!formData.end_date) return showNotification('A data de término é obrigatória.', 'error');
      if (!formData.start_time || !formData.end_time) return showNotification('Os horários são obrigatórios.', 'error');
      if (!formData.price.trim()) return showNotification('O preço é obrigatório (use 0 para gratuito).', 'error');
    } else {
      if (!formData.opening_time || !formData.closing_time) return showNotification('Os horários de funcionamento são obrigatórios.', 'error');
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('accessibility', formData.accessibility);

      if (selectedLocation) {
        // Different key names for location name based on backend requirement
        const locationNameKey = type === 'event' ? 'location_name_input' : 'address_name';
        formDataToSend.append(locationNameKey, selectedLocation.name);
        formDataToSend.append('latitude', String(selectedLocation.latitude));
        formDataToSend.append('longitude', String(selectedLocation.longitude));
      }

      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (type === 'event') {
        const startDateTime = `${formData.start_date}T${formData.start_time}:00`;
        const endDateTime = `${formData.end_date}T${formData.end_time}:00`;
        formDataToSend.append('start_date', startDateTime);
        formDataToSend.append('end_date', endDateTime);
        formDataToSend.append('start_time', `${formData.start_time}:00`);
        formDataToSend.append('end_time', `${formData.end_time}:00`);
        formDataToSend.append('price', formData.price);

        // Debug: log what we're sending
        console.log('Sending event data:');
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        await eventsService.createEvent(formDataToSend as any);
      } else {
        formDataToSend.append('opening_time', `${formData.opening_time}:00`);
        formDataToSend.append('closing_time', `${formData.closing_time}:00`);

        // Debug: log what we're sending
        console.log('Sending place data:');
        for (let pair of formDataToSend.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        await placesService.createTouristSpot(formDataToSend as any);
      }

      showNotification(config.successMessage, 'success', 2000);
      setTimeout(() => navigate(config.returnPath), 2000);
    } catch (err: any) {
      console.error('Full error:', err);
      console.error('Error response:', err.response?.data);

      // Try to extract detailed error message
      let errorMessage = 'Erro ao criar item. Tente novamente.';

      if (err.response?.data) {
        const data = err.response.data;

        // Check for field-specific errors
        if (typeof data === 'object') {
          const errors = Object.entries(data)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              }
              return `${field}: ${messages}`;
            })
            .join('; ');

          if (errors) {
            errorMessage = errors;
          }
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }

      showNotification(errorMessage, 'error', 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar a criação? Os dados não serão salvos.')) {
      navigate(config.returnPath);
    }
  };

  return (
    <PageWrapper>
      <Navbar />

      {notification && (
        <Notification $type={notification.type}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span style={{ flex: 1, fontSize: '0.95rem', fontWeight: 500 }}>{notification.message}</span>
          <NotificationClose onClick={() => setNotification(null)}>
            <XCircle size={18} />
          </NotificationClose>
        </Notification>
      )}

      <Container>
        <Header>
          <Title>{config.title}</Title>
          <Subtitle>{config.subtitle}</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Imagem */}
          <Section>
            <SectionTitle><ImageIcon size={20} /> {config.labels.image}</SectionTitle>
            <FormGroup>
              <Label>Imagem de Capa</Label>
              {imagePreview ? (
                <ImagePreviewContainer>
                  <ImagePreview src={imagePreview} alt="Preview" />
                  <RemoveImageButton type="button" onClick={removeImage} disabled={isLoading}>
                    <XCircle size={18} /> Remover Imagem
                  </RemoveImageButton>
                </ImagePreviewContainer>
              ) : (
                <UploadBox>
                  <input id="image" type="file" accept="image/*" onChange={handleImageChange} disabled={isLoading} style={{ display: 'none' }} />
                  <UploadLabel htmlFor="image">
                    <ImageIcon size={32} />
                    <span>Clique para selecionar uma imagem</span>
                    <small>JPEG, PNG ou WebP (máximo 5MB)</small>
                  </UploadLabel>
                </UploadBox>
              )}
            </FormGroup>
          </Section>

          {/* Info Básica */}
          <Section>
            <SectionTitle>Informações Básicas</SectionTitle>
            <FormGroup>
              <Label htmlFor="name">{config.labels.name} *</Label>
              <Input id="name" type="text" placeholder={config.labels.namePlaceholder} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isLoading} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Descrição *</Label>
              <TextArea id="description" placeholder="Descreva..." rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isLoading} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="category">Categoria *</Label>
              <Select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={isLoading}>
                <option value="">Selecione uma categoria</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </Select>
            </FormGroup>
          </Section>

          {/* Data e Hora (Eventos) */}
          {config.fields.hasDateRange && (
            <Section>
              <SectionTitle><Calendar size={20} /> Data e Horário</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="start_date">Data de Início *</Label>
                  <Input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} disabled={isLoading} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="end_date">Data de Término *</Label>
                  <Input id="end_date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} disabled={isLoading} />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="start_time">Horário de Início *</Label>
                  <Input id="start_time" type="time" value={formData.start_time} onChange={(e) => setFormData({ ...formData, start_time: e.target.value })} disabled={isLoading} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="end_time">Horário de Término *</Label>
                  <Input id="end_time" type="time" value={formData.end_time} onChange={(e) => setFormData({ ...formData, end_time: e.target.value })} disabled={isLoading} />
                </FormGroup>
              </FormRow>
            </Section>
          )}

          {/* Horário de Funcionamento (Pontos Turísticos) */}
          {config.fields.hasOpeningHours && (
            <Section>
              <SectionTitle><Clock size={20} /> Horário de Funcionamento</SectionTitle>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="opening_time">Horário de Abertura *</Label>
                  <Input id="opening_time" type="time" value={formData.opening_time} onChange={(e) => setFormData({ ...formData, opening_time: e.target.value })} disabled={isLoading} />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="closing_time">Horário de Fechamento *</Label>
                  <Input id="closing_time" type="time" value={formData.closing_time} onChange={(e) => setFormData({ ...formData, closing_time: e.target.value })} disabled={isLoading} />
                </FormGroup>
              </FormRow>
            </Section>
          )}

          {/* Localização e Preço */}
          <Section>
            <SectionTitle><MapPin size={20} /> Localização {config.fields.hasPrice && 'e Valores'}</SectionTitle>
            <FormGroup>
              <Label>{config.labels.location} *</Label>
              <SearchInputContainer>
                <SearchInputWrapper>
                  <Search size={18} />
                  <Input
                    type="text"
                    placeholder="Busque por endereço, local ou bairro..."
                    value={locationSearch}
                    onChange={(e) => handleLocationSearch(e.target.value)}
                    onFocus={() => locationSearch.length >= 2 && setShowLocationDropdown(true)}
                    onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </SearchInputWrapper>
                {selectedLocation && (
                  <SelectedLocation>
                    <span>✓ {selectedLocation.name}</span>
                    <ClearLocationButton type="button" onClick={() => { setSelectedLocation(null); setLocationSearch(''); }} disabled={isLoading}>
                      <XCircle size={16} />
                    </ClearLocationButton>
                  </SelectedLocation>
                )}
                {showLocationDropdown && locationSearchResults.length > 0 && (
                  <LocationDropdown>
                    {isSearchingLocation ? (
                      <div style={{ padding: '1rem', color: '#666' }}>Buscando...</div>
                    ) : (
                      locationSearchResults.map((result) => (
                        <DropdownItem key={result.place_id} type="button" onClick={() => handleLocationSelect(result)}>
                          <MapPin size={14} />
                          <div>
                            <div style={{ fontWeight: 500 }}>{result.name || result.display_name.split(',')[0].trim()}</div>
                            <div style={{ fontSize: '0.85rem', color: '#999' }}>{result.display_name.split(',').slice(1, 3).join(', ')}</div>
                          </div>
                        </DropdownItem>
                      ))
                    )}
                  </LocationDropdown>
                )}
              </SearchInputContainer>
            </FormGroup>

            {config.fields.hasPrice && (
              <FormGroup>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input id="price" type="number" step="0.01" min="0" placeholder="0.00 para eventos gratuitos" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} disabled={isLoading} />
              </FormGroup>
            )}
          </Section>

          {/* Acessibilidade */}
          <Section>
            <SectionTitle><Accessibility size={20} /> Acessibilidade</SectionTitle>
            <FormGroup>
              <Label htmlFor="accessibility">Recursos de Acessibilidade</Label>
              <TextArea id="accessibility" placeholder="Ex: Rampas de acesso..." rows={3} value={formData.accessibility} onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })} disabled={isLoading} />
            </FormGroup>
          </Section>

          {/* Ações */}
          <FormActions>
            <Button type="button" $variant="outline" onClick={handleCancel} disabled={isLoading}>
              <XCircle size={18} /> Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save size={18} /> {isLoading ? 'Criando...' : config.title.replace('Criar Novo', 'Criar')}
            </Button>
          </FormActions>
        </Form>
      </Container>
    </PageWrapper>
  );
}

export default CreateItemPage;