import styled from 'styled-components';
import { Calendar, Clock, MapPin, Search, Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import { eventsService, type Event } from '@/services/events';
import { placesService, type TouristSpotListItem } from '@/services/places';
import { useAuth } from '@/contexts/AuthContext';

// --- Types ---

type ListingType = 'events' | 'places';

interface ListingPageProps {
  type: ListingType;
}

// --- Styled Components ---

const PageWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const HeaderSection = styled.section`
  width: 100%;
  background: #ffffff;
  padding: 2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #2d2d2d;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const FiltersSection = styled.section`
  width: 100%;
  background-color: #f5f5f5;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 480px) {
    padding: 1rem 0.75rem;
  }
`;

const FiltersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 200px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 0.95rem;
  outline: none;
  color: #333;

  &::placeholder {
    color: #9ca3af;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 180px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  background-color: #ffffff;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: #3b82f6;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
  }
`;

const ContentSection = styled.section`
  width: 100%;
  background-color: #ffffff;
  padding: 3rem 1.5rem;
  min-height: 60vh;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  padding: 2rem;
  background-color: #f9fafb;
  border-radius: 8px;
  border: 1px dashed #e5e7eb;
`;

const EmptyText = styled.p`
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
`;

// --- Component Logic ---

function ListingPage({ type }: ListingPageProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas Categorias']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  // Configuration based on type
  const config = type === 'events' ? {
    title: 'Eventos',
    createButtonText: 'Criar Evento',
    createPath: '/eventos/criar',
    detailPath: '/eventos',
    emptyMessage: 'Nenhum evento encontrado',
    loadingMessage: 'Carregando eventos...',
    errorMessage: 'Falha ao carregar eventos. Tente novamente.',
    countSuffix: 'Eventos Encontrados',
    service: eventsService,
  } : {
    title: 'Pontos Turísticos',
    createButtonText: 'Criar Ponto Turístico',
    createPath: '/pontos-turisticos/criar',
    detailPath: '/pontos-turisticos',
    emptyMessage: 'Nenhum ponto turístico encontrado',
    loadingMessage: 'Carregando pontos turísticos...',
    errorMessage: 'Falha ao carregar pontos turísticos. Tente novamente.',
    countSuffix: 'Locais Encontrados',
    service: placesService,
  };

  useEffect(() => {
    loadItems();
    loadCategories();
  }, [type]);

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = type === 'events'
        ? await eventsService.getEvents({ filter: 'upcoming' })
        : await placesService.getTouristSpots();
      setItems(data);
    } catch (err: any) {
      setError(config.errorMessage);
      console.error('Error loading items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await config.service.getCategories();
      const categoryNames = data.map((cat: any) => cat.name);
      setCategories(['Todas Categorias', ...categoryNames]);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' ||
      (type === 'events' ? item.category_name : item.category_name) === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' ||
      (type === 'events' ? item.location_name : item.location)?.includes(selectedLocation);

    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCreate = () => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    navigate(config.createPath);
  };

  // Render Event Card
  const renderEventCard = (event: Event) => {
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');
    const formatTime = (timeString: string) => timeString.slice(0, 5);
    const formatPrice = (price: number | string) => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      return numPrice === 0 ? 'Gratuito' : `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
    };

    return (
      <Card
        key={event.id}
        image={event.image_url || "/event-placeholder.jpg"}
        onClick={() => navigate(`${config.detailPath}/${event.id}`)}
      >
        <Card.Title>{event.name}</Card.Title>
        <Card.Description>{event.description}</Card.Description>
        <Card.Meta>
          <Card.MetaItem icon={<Calendar size={14} />}>
            {formatDate(event.start_date)}
          </Card.MetaItem>
          <Card.MetaItem icon={<Clock size={14} />}>
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </Card.MetaItem>
          <Card.MetaItem icon={<MapPin size={14} />}>
            {event.location_name || 'Local não especificado'}
          </Card.MetaItem>
          <Card.MetaItem>
            <span style={{ color: '#16a34a', fontWeight: '600' }}>
              {formatPrice(event.price)}
            </span>
          </Card.MetaItem>
        </Card.Meta>
        <Card.Action onClick={() => navigate(`${config.detailPath}/${event.id}`)}>
          Ver Detalhes <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </Card.Action>
      </Card>
    );
  };

  // Render Place Card
  const renderPlaceCard = (place: TouristSpotListItem) => {
    return (
      <Card
        key={place.id}
        image={place.image_url || '/default-place.png'}
        onClick={() => navigate(`${config.detailPath}/${place.id}`)}
      >
        <Card.Title>{place.name}</Card.Title>
        <Card.Description>{place.description}</Card.Description>
        <Card.Meta>
          <Card.MetaItem icon={<MapPin size={14} />}>
            {place.location || 'Localização não especificada'}
          </Card.MetaItem>
        </Card.Meta>
        <Card.Action onClick={() => navigate(`${config.detailPath}/${place.id}`)}>
          Ver Detalhes <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </Card.Action>
      </Card>
    );
  };

  return (
    <PageWrapper>
      <Navbar />

      <HeaderSection>
        <HeaderContainer>
          <HeaderContent>
            <div>
              <HeaderTitle>{config.title}</HeaderTitle>
              <HeaderSubtitle>
                {filteredItems.length} {config.countSuffix}
              </HeaderSubtitle>
            </div>
            <CreateButton onClick={handleCreate}>
              <Plus size={20} />
              {config.createButtonText}
            </CreateButton>
          </HeaderContent>
        </HeaderContainer>
      </HeaderSection>

      <FiltersSection>
        <FiltersContainer>
          <SearchBox>
            <Search size={18} color="#9ca3af" />
            <SearchInput
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>

          <FilterGroup>
            <FilterSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterSelect
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
        </FiltersContainer>
      </FiltersSection>

      <ContentSection>
        <ContentContainer>
          {isLoading ? (
            <EmptyState>
              <EmptyText>{config.loadingMessage}</EmptyText>
            </EmptyState>
          ) : error ? (
            <EmptyState>
              <EmptyText>{error}</EmptyText>
            </EmptyState>
          ) : (
            <>
              <CardsGrid>
                {filteredItems.map(item =>
                  type === 'events' ? renderEventCard(item) : renderPlaceCard(item)
                )}
              </CardsGrid>

              {filteredItems.length === 0 && !isLoading && (
                <EmptyState>
                  <Search size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                  <EmptyText>{config.emptyMessage} com os filtros selecionados.</EmptyText>
                </EmptyState>
              )}
            </>
          )}
        </ContentContainer>
      </ContentSection>

      <Footer />
    </PageWrapper>
  );
}

export default ListingPage;
