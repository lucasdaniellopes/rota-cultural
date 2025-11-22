import styled, { css, keyframes } from 'styled-components';
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Save, XCircle, AlertTriangle, CheckCircle, Accessibility, Image as ImageIcon, Search, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import { placesService, type Category } from '@/services/places';
import { geocodingService, type NominatimResult } from '@/services/geocoding';
import { useAuth } from '@/contexts/AuthContext';

// --- Animations ---
const slideIn = keyframes`
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

// --- Styled Components (Reutilizados do CreateEventPage) ---

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

// --- Logic & Component ---

type NotificationType = 'success' | 'error' | 'info';

interface LocationCoordinates {
  latitude: number;
  longitude: number;
  name: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Religioso', item_type: 'place' },
  { id: 2, name: 'Cultural', item_type: 'place' },
  { id: 3, name: 'Histórico', item_type: 'place' },
  { id: 4, name: 'Natureza', item_type: 'place' },
  { id: 5, name: 'Comércio', item_type: 'place' },
  { id: 6, name: 'Lazer', item_type: 'place' },
  { id: 7, name: 'Gastronomia', item_type: 'place' },
  { id: 8, name: 'Museu', item_type: 'place' },
];

function CreateTouristPlacePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [notification, setNotification] = useState<{message: string, type: NotificationType} | null>(null);
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
    opening_time: '',
    closing_time: '',
    accessibility: '',
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
      const data = await placesService.getCategories();
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch (err) {
      console.warn('Usando categorias pré-definidas');
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
        setLocationSearchResults(results);
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
    
    if (!formData.name.trim()) return showNotification('O nome é obrigatório.', 'error');
    if (!formData.description.trim()) return showNotification('A descrição é obrigatória.', 'error');
    if (!formData.category) return showNotification('Selecione uma categoria.', 'error');
    if (!selectedLocation) return showNotification('Selecione uma localização.', 'error');
    if (!formData.opening_time || !formData.closing_time) return showNotification('Os horários de funcionamento são obrigatórios.', 'error');

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('opening_time', `${formData.opening_time}:00`);
      formDataToSend.append('closing_time', `${formData.closing_time}:00`);
      formDataToSend.append('accessibility', formData.accessibility);
      
      if (selectedLocation) {
        formDataToSend.append('address_name', selectedLocation.name);
        formDataToSend.append('latitude', String(selectedLocation.latitude));
        formDataToSend.append('longitude', String(selectedLocation.longitude));
      }
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      await placesService.createTouristSpot(formDataToSend as any);
      showNotification('Ponto turístico criado com sucesso!', 'success', 2000);
      setTimeout(() => navigate('/pontos-turisticos'), 2000);
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.response?.data?.detail || 'Erro ao criar ponto turístico. Tente novamente.';
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Deseja cancelar a criação? Os dados não serão salvos.')) {
      navigate('/pontos-turisticos');
    }
  };

  return (
    <PageWrapper>
      <Navbar />

      {notification && (
        <Notification $type={notification.type}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
          <span style={{flex: 1, fontSize: '0.95rem', fontWeight: 500}}>{notification.message}</span>
          <NotificationClose onClick={() => setNotification(null)}>
            <XCircle size={18} />
          </NotificationClose>
        </Notification>
      )}

      <Container>
        <Header>
          <Title>Criar Novo Ponto Turístico</Title>
          <Subtitle>Preencha os dados do ponto turístico</Subtitle>
        </Header>

        <Form onSubmit={handleSubmit}>
          {/* Imagem do Local */}
          <Section>
            <SectionTitle><ImageIcon size={20} /> Imagem do Local</SectionTitle>
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

          {/* Informações Básicas */}
          <Section>
            <SectionTitle>Informações Básicas</SectionTitle>
            <FormGroup>
              <Label htmlFor="name">Nome do Local *</Label>
              <Input id="name" type="text" placeholder="Ex: Igreja Nossa Senhora da Conceição" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} disabled={isLoading} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="description">Descrição *</Label>
              <TextArea id="description" placeholder="Descreva o local, sua história, características..." rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} disabled={isLoading} />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="category">Categoria *</Label>
              <Select id="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} disabled={isLoading}>
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            </FormGroup>
          </Section>

          {/* Horário de Funcionamento */}
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

          {/* Localização */}
          <Section>
            <SectionTitle><MapPin size={20} /> Localização</SectionTitle>
            <FormGroup>
              <Label>Buscar Endereço *</Label>
              <SearchInputContainer>
                <SearchInputWrapper>
                  <Search size={18} />
                  <Input 
                    type="text" 
                    placeholder="Digite o endereço ou nome do local..." 
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
                      <div style={{padding: '1rem', color: '#666'}}>Buscando...</div>
                    ) : (
                      locationSearchResults.map((result) => (
                        <DropdownItem key={result.place_id} type="button" onClick={() => handleLocationSelect(result)}>
                          <MapPin size={14} />
                          <div>
                            <div style={{fontWeight: 500}}>{result.name || result.display_name.split(',')[0].trim()}</div>
                            <div style={{fontSize: '0.85rem', color: '#999'}}>{result.display_name.split(',').slice(1, 3).join(', ')}</div>
                          </div>
                        </DropdownItem>
                      ))
                    )}
                  </LocationDropdown>
                )}
              </SearchInputContainer>
            </FormGroup>
          </Section>

          {/* Acessibilidade */}
          <Section>
            <SectionTitle><Accessibility size={20} /> Acessibilidade (Opcional)</SectionTitle>
            <FormGroup>
              <Label htmlFor="accessibility">Recursos de Acessibilidade</Label>
              <TextArea id="accessibility" placeholder="Descreva os recursos de acessibilidade disponíveis (rampas, elevadores, etc.)" rows={3} value={formData.accessibility} onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })} disabled={isLoading} />
            </FormGroup>
          </Section>

          {/* Ações */}
          <FormActions>
            <Button type="button" $variant="outline" onClick={handleCancel} disabled={isLoading}>
              <XCircle size={18} /> Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save size={18} /> {isLoading ? 'Criando...' : 'Criar Ponto Turístico'}
            </Button>
          </FormActions>
        </Form>
      </Container>
    </PageWrapper>
  );
}

export default CreateTouristPlacePage;