import styled from 'styled-components';
import { Calendar, Clock, MapPin, Search, Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { eventsService, type Event } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';


// --- Styled Components ---

const PageWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
`;

// Header Section (Dark)
const HeaderSection = styled.section`
  width: 100%;
  background: #212121;
  padding: 2rem 1.5rem;
  
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
  color: #ffffff;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
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
  background-color: #ffffff;
  color: #212121;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Filters Section
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

// Content Section
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

function EventsPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // States
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas Categorias']);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');
  
  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventsService.getEvents({ filter: 'upcoming' });
      setEvents(data);
    } catch (err: any) {
      setError('Falha ao carregar eventos. Tente novamente.');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await eventsService.getCategories();
      const categoryNames = data.map(cat => cat.name);
      setCategories(['Todas Categorias', ...categoryNames]);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  // Filtering Logic
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' || event.category_name === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' || event.location_name?.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    navigate('/eventos/criar');
  };

  // Event Card Component
  const EventCard = ({ event }: { event: Event }) => {

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    const formatTime = (timeString: string) => {
      return timeString.slice(0, 5);
    };

    const formatPrice = (price: number | string) => {
      const numPrice = typeof price === 'string' ? parseFloat(price) : price;
      if (numPrice === 0) return 'Gratuito';
      return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
    };

    return (
      <Card 
        image={event.image_url || "/event-placeholder.jpg"}
        onClick={() => navigate(`/eventos/${event.id}`)}
      >
        <Card.Title>
          {event.name}
        </Card.Title>
        
        <Card.Description>
          {event.description}
        </Card.Description>
        
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
        
        <Card.Action onClick={() => navigate(`/eventos/${event.id}`)}>
          Ver Detalhes <ArrowRight size={16} style={{ marginLeft: 'auto' }} />
        </Card.Action>
      </Card>
    );
  };

  return (
    <PageWrapper>
      <Navbar />
      
      {/* Header Section */}
      <HeaderSection>
        <HeaderContainer>
          <HeaderContent>
            <div>
              <HeaderTitle>Eventos</HeaderTitle>
              <HeaderSubtitle>
                {filteredEvents.length} Eventos Encontrados
              </HeaderSubtitle>
            </div>
            <CreateButton onClick={handleCreateEvent}>
              <Plus size={20} />
              Criar Evento
            </CreateButton>
          </HeaderContent>
        </HeaderContainer>
      </HeaderSection>

      {/* Filters Section */}
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

      {/* Content Section */}
      <ContentSection>
        <ContentContainer>
          {isLoading ? (
            <EmptyState>
              <EmptyText>Carregando eventos...</EmptyText>
            </EmptyState>
          ) : error ? (
            <EmptyState>
              <EmptyText>{error}</EmptyText>
            </EmptyState>
          ) : (
            <>
              <CardsGrid>
                {filteredEvents.map(event => (
                  <EventCard key={event.id} event={event} />
                ))}
              </CardsGrid>

              {filteredEvents.length === 0 && !isLoading && (
                <EmptyState>
                  <Search size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                  <EmptyText>Nenhum evento encontrado com os filtros selecionados.</EmptyText>
                </EmptyState>
              )}
            </>
          )}
        </ContentContainer>
      </ContentSection>
    </PageWrapper>
  );
}

export default EventsPage;