import styled from 'styled-components';
import { Calendar, MapPin, Clock, Eye, Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { eventsService } from '../services/events';
import { placesService, type TouristSpotListItem } from '../services/places';

// --- Styled Components ---

// Container Geral
const PageWrapper = styled.div`
  font-family: 'Inter', sans-serif;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fff3cd;
  color: #856404;
  text-align: center;
  margin-bottom: 1rem;
`;

// --- Hero & CTA Sections (Dark Theme) ---
const DarkSection = styled.section`
  width: 100%;
  background: #212121;
  padding: 3rem 1.5rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
  }
`;

const HeroContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;

  @media (max-width: 768px) { font-size: 1.75rem; }
  @media (max-width: 480px) { font-size: 1.5rem; }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.5;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 768px) { font-size: 0.95rem; }
  @media (max-width: 480px) { font-size: 0.9rem; }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

// Botões
const ButtonBase = styled.button`
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 0.65rem 1.25rem;
    font-size: 0.9rem;
  }
  @media (max-width: 480px) {
    width: 100%;
    padding: 0.75rem 1rem;
  }
`;

const ButtonPrimary = styled(ButtonBase)`
  background-color: #ffffff;
  color: #212121;
  border: none;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonSecondary = styled(ButtonBase)`
  background-color: transparent;
  color: #ffffff;
  border: 2px solid #ffffff;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

// --- Content Sections (Light Theme) ---
const LightSection = styled.section<{ $variant?: 'gray' }>`
  width: 100%;
  background-color: ${props => props.$variant === 'gray' ? '#f8f8f8' : '#ffffff'};
  padding: 3rem 1.5rem;
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TitleWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #0052cc; // Azul original do CSS
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
`;

const SectionSubtitle = styled.p`
  font-size: 0.95rem;
  color: #666666;
  margin: 0;
`;

// Grid de Cards
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const LoadingMessage = styled.p`
  grid-column: 1 / -1;
  text-align: center;
  padding: 2rem;
  color: #666;
`;

// --- Component Logic ---

function HomePage() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [touristPlaces, setTouristPlaces] = useState<TouristSpotListItem[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar eventos ao montar o componente
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const events = await eventsService.getFeaturedEvents();
        // Formatar datas para exibição
        const formattedEvents = events.map(event => ({
          ...event,
          id: event.id.toString(),
          title: event.name,
          image: event.image_url || '/default-event.png',
          date: new Date(event.start_date).toLocaleDateString('pt-BR'),
          time: `${event.start_time} - ${event.end_time}`,
          location: event.location_name || 'Patos - PB',
          price: event.is_free ? 'Gratuito' : `R$ ${event.price}`,
        }));
        setUpcomingEvents(formattedEvents);
      } catch (err) {
        console.error('Erro ao carregar eventos:', err);
        setError('Erro ao carregar eventos');
        setUpcomingEvents([]);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    loadEvents();
  }, []);

  // Carregar pontos turísticos ao montar o componente
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setIsLoadingPlaces(true);
        const places = await placesService.getFeaturedTouristSpots();
        setTouristPlaces(places);
      } catch (err) {
        console.error('Erro ao carregar pontos turísticos:', err);
        setError('Erro ao carregar pontos turísticos');
        setTouristPlaces([]);
      } finally {
        setIsLoadingPlaces(false);
      }
    };

    loadPlaces();
  }, []);

  return (
    <PageWrapper>
      <Navbar />
      
      {error && (
        <ErrorMessage>{error}</ErrorMessage>
      )}
      
      {/* Hero Section */}
      <DarkSection>
        <HeroContainer>
          <HeroTitle>Descubro os Melhores Destinos e Eventos</HeroTitle>
          <HeroSubtitle>Explore pontos turísticos, eventos culturais e descubra os melhores lugares para visitar</HeroSubtitle>
          
          <ActionButtons>
            <ButtonPrimary onClick={() => navigate('/eventos')}>
              <Calendar size={18} />
              Ver Eventos
            </ButtonPrimary>
            <ButtonSecondary onClick={() => navigate('/pontos-turisticos')}>
              <MapPin size={18} />
              Pontos Turísticos
            </ButtonSecondary>
          </ActionButtons>
        </HeroContainer>
      </DarkSection>

      {/* Events Section */}
      <LightSection>
        <SectionContainer>
          <SectionHeader>
            <TitleWithIcon>
              <Calendar />
              <SectionTitle>Próximos Eventos</SectionTitle>
            </TitleWithIcon>
            <SectionSubtitle>Os eventos mais populares da cidade</SectionSubtitle>
          </SectionHeader>
          
          <CardsGrid>
            {isLoadingEvents ? (
              <LoadingMessage>Carregando eventos...</LoadingMessage>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <Card 
                  key={event.id}
                  image={event.image}
                  onClick={() => navigate(`/eventos/${event.id}`)}
                >
                  <Card.Title>
                    {event.title}
                  </Card.Title>
                  
                  <Card.Description>
                    {event.description}
                  </Card.Description>
                  
                  <Card.Meta>
                    <Card.MetaItem icon={<Calendar size={14} />}>
                      {event.date}
                    </Card.MetaItem>
                    <Card.MetaItem icon={<Clock size={14} />}>
                      {event.time}
                    </Card.MetaItem>
                    <Card.MetaItem icon={<MapPin size={14} />}>
                      {event.location}
                    </Card.MetaItem>
                    <Card.MetaItem>
                      {event.price}
                    </Card.MetaItem>
                  </Card.Meta>
                  
                  <Card.Action onClick={() => navigate(`/eventos/${event.id}`)}>
                    Como Chegar
                  </Card.Action>
                </Card>
              ))
            ) : (
              <LoadingMessage>Nenhum evento encontrado</LoadingMessage>
            )}
          </CardsGrid>
        </SectionContainer>
      </LightSection>

      {/* Tourist Section */}
      <LightSection $variant="gray">
        <SectionContainer>
          <SectionHeader>
            <TitleWithIcon>
              <Landmark />
              <SectionTitle>Pontos Turísticos em Destaque</SectionTitle>
            </TitleWithIcon>
            <SectionSubtitle>Os lugares mais visitados e bem avaliados</SectionSubtitle>
          </SectionHeader>
          
          <CardsGrid>
            {isLoadingPlaces ? (
              <LoadingMessage>Carregando pontos turísticos...</LoadingMessage>
            ) : touristPlaces.length > 0 ? (
              touristPlaces.map(place => (
                <Card 
                  key={place.id}
                  image={place.image_url || '/default-place.png'}
                  onClick={() => navigate(`/pontos-turisticos/${place.id}`)}
                >
                  <Card.Title>
                    {place.name}
                  </Card.Title>
                  
                  <Card.Description>
                    {place.description}
                  </Card.Description>
                  
                  <Card.Meta>
                    <Card.MetaItem icon={<MapPin size={14} />}>
                      {place.location || 'Patos - PB'}
                    </Card.MetaItem>
                  </Card.Meta>
                  
                  <Card.Action onClick={() => navigate(`/pontos-turisticos/${place.id}`)}>
                    Como Chegar
                  </Card.Action>
                </Card>
              ))
            ) : (
              <LoadingMessage>Nenhum ponto turístico encontrado</LoadingMessage>
            )}
          </CardsGrid>
        </SectionContainer>
      </LightSection>

      {/* CTA Section */}
      <DarkSection>
        <HeroContainer>
          <HeroTitle>Planeje Sua Visita Perfeita</HeroTitle>
          <HeroSubtitle>Descubra eventos próximos, encontre os melhores lugares para visitar e planeje sua viagem perfeita</HeroSubtitle>
          
          <ActionButtons>
            <ButtonPrimary onClick={() => navigate('/eventos')}>
              <Calendar size={18} />
              Descubra Eventos
            </ButtonPrimary>
            <ButtonSecondary onClick={() => navigate('/avaliacoes')}>
              <Eye size={18} />
              Avaliar o Site
            </ButtonSecondary>
          </ActionButtons>
        </HeroContainer>
      </DarkSection>
    </PageWrapper>
  );
}

export default HomePage;