import styled, { keyframes, css } from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Heart, ArrowLeft, Accessibility, AlertTriangle, Loader } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { eventsService, type Event } from '@/services/events';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorite } from '@/hooks/useFavorite';

// --- Animations ---
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  font-family: 'Inter', sans-serif;
  background-color: #ffffff;
  min-height: 100vh;
`;

const HeroSection = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  background: #212121;

  @media (max-width: 768px) { height: 280px; }
`;

const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
  color: #999;
`;

const BackButtonOverlay = styled.button`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background: white;
    transform: translateX(-4px);
  }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) { padding: 24px 16px; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 6px 16px;
  background: #141414;
  color: #ffffff;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) { font-size: 24px; }
`;

const FavoriteButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &:hover {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  ${props => props.$active && css`
    background: #ff6b6b;
    border-color: #ff6b6b;
    color: white;
  `}
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 12px; }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;

  svg {
    flex-shrink: 0;
    color: #141414;
    margin-top: 2px;
  }
`;

const InfoLabel = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0;
`;

const InfoValue = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin: 4px 0 0 0;
`;

const Section = styled.section`
  margin-bottom: 40px;

  h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 16px 0;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  h2 { margin: 0; }
  svg { color: #4CAF50; }
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin: 0;
`;

const MapPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #999;

  svg { color: #ccc; }
  
  p {
    font-size: 14px;
    font-weight: 500;
    margin: 0;
    text-align: center;
  }
`;

const MapButton = styled.button`
  margin-top: 12px;
  padding: 10px 24px;
  background: #141414;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 20, 20, 0.2);
  }
`;

const CtaSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) { flex-direction: column; }
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const PrimaryButton = styled(BaseButton)`
  background: #141414;
  color: white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(20, 20, 20, 0.2);
  }
`;

// --- Loading & Error ---
const CenterState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: #666;
  text-align: center;
  padding: 20px;

  h1 { font-size: 24px; margin: 0; color: #1a1a1a; }
  p { font-size: 16px; margin: 0; max-width: 400px; }
`;

const LoaderIcon = styled(Loader)`
  animation: ${spin} 1s linear infinite;
  color: #141414;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #141414;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 16px;

  &:hover { background-color: #000; transform: translateY(-2px); }
`;

// --- Logic ---

function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const { isFavorited, toggleFavorite } = useFavorite(event?.id || 0, 'event');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventsService.getEventById(parseInt(id!));
      setEvent(data);
    } catch (err: any) {
      console.error('Error loading event:', err);
      setError('Falha ao carregar evento. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5); // HH:MM
  };

  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice === 0) return 'Gratuito';
    return `R$ ${numPrice.toFixed(2).replace('.', ',')}`;
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Navbar />
        <CenterState>
          <LoaderIcon size={48} />
          <p>Carregando evento...</p>
        </CenterState>
      </PageWrapper>
    );
  }

  if (error || !event) {
    return (
      <PageWrapper>
        <Navbar />
        <CenterState>
          <AlertTriangle size={48} />
          <h1>Evento não encontrado</h1>
          <p>{error || 'O evento que você procura não existe ou foi removido.'}</p>
          <BackButton onClick={() => navigate('/eventos')}>
            <ArrowLeft size={18} /> Voltar para Eventos
          </BackButton>
        </CenterState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />

      <HeroSection>
        {event.image_url ? (
          <HeroImage src={event.image_url} alt={event.name} />
        ) : (
          <HeroPlaceholder>
            <MapPin size={64} />
          </HeroPlaceholder>
        )}
        <BackButtonOverlay onClick={() => navigate('/eventos')}>
          <ArrowLeft size={20} />
        </BackButtonOverlay>
      </HeroSection>

      <Container>
        <Header>
          <div>
            <CategoryBadge>{event.category_name || 'Evento'}</CategoryBadge>
            <Title>{event.name}</Title>
          </div>
          <FavoriteButton
            $active={isFavorited}
            onClick={toggleFavorite}
            title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            disabled={!isAuthenticated}
          >
            <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
          </FavoriteButton>
        </Header>

        <InfoGrid>
          <InfoItem>
            <Calendar size={20} />
            <div>
              <InfoLabel>Data Início</InfoLabel>
              <InfoValue>{formatDate(event.start_date)}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <Clock size={20} />
            <div>
              <InfoLabel>Horário</InfoLabel>
              <InfoValue>{formatTime(event.start_time)} - {formatTime(event.end_time)}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <DollarSign size={20} />
            <div>
              <InfoLabel>Entrada</InfoLabel>
              <InfoValue>{formatPrice(event.price)}</InfoValue>
            </div>
          </InfoItem>

          <InfoItem>
            <MapPin size={20} />
            <div>
              <InfoLabel>Local</InfoLabel>
              <InfoValue>{event.location_name || 'Local não especificado'}</InfoValue>
            </div>
          </InfoItem>
        </InfoGrid>

        <Section>
          <h2>Sobre</h2>
          <Text>{event.description}</Text>
        </Section>

        {event.accessibility && (
          <Section>
            <SectionHeader>
              <Accessibility size={20} />
              <h2>Acessibilidade</h2>
            </SectionHeader>
            <Text>{event.accessibility}</Text>
          </Section>
        )}

        <Section>
          <h2>Localização</h2>
          <MapPlaceholder>
            <MapPin size={40} />
            <p>{event.location_name || 'Local não especificado'}</p>
            <MapButton onClick={() => navigate('/mapa')}>
              Ver no Mapa
            </MapButton>
          </MapPlaceholder>
        </Section>

        <CtaSection>
          <PrimaryButton onClick={() => navigate('/mapa')}>
            Como Chegar
          </PrimaryButton>
        </CtaSection>
      </Container>
    </PageWrapper>
  );
}

export default EventDetailPage;