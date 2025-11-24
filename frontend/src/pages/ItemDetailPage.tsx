import styled, { keyframes, css } from 'styled-components';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, Heart, ArrowLeft, Accessibility, AlertTriangle, Loader, Edit, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { eventsService } from '@/services/events';
import { placesService } from '@/services/places';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorite } from '@/hooks/useFavorite';

// --- Animations ---
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
  height: 300px;
  overflow: hidden;
  background: #212121;

  @media (max-width: 768px) { height: 220px; }
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
  padding: 24px 20px;
  animation: ${fadeIn} 0.4s ease-out;

  @media (max-width: 768px) { padding: 20px 16px; }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;

  @media (max-width: 768px) { font-size: 22px; }
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
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 768px) { grid-template-columns: 1fr; gap: 10px; }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;

  svg {
    flex-shrink: 0;
    color: #141414;
    margin-top: 2px;
  }
`;

const InfoLabel = styled.p`
  font-size: 11px;
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
  margin-bottom: 24px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 12px 0;
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
  gap: 8px;
  padding: 24px 20px;
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

const CtaSection = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const PrimaryButton = styled.button`
  padding: 14px 32px;
  background: #141414;
  color: white;
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

// --- Types & Interfaces ---

interface ItemDetailPageProps {
  type: 'event' | 'place';
}

interface DisplayData {
  id: number;
  title: string;
  image_url?: string;
  category_name?: string;
  description: string;
  accessibility?: string;
  location_display: string;
  organizer?: number;
  latitude?: number;
  longitude?: number;
  infoItems: {
    icon: React.ElementType;
    label: string;
    value: string;
  }[];
  extraSections?: {
    title: string;
    content: string;
  }[];
}

// --- Component Logic ---

function ItemDetailPage({ type }: ItemDetailPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [data, setData] = useState<DisplayData | null>(null);
  const { isFavorited, toggleFavorite } = useFavorite(parseInt(id || '0'), type === 'event' ? 'event' : 'touristspot');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default center (Patos, PB)
  const center: [number, number] = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '-7.0227'),
    parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '-37.2744')
  ];

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id, type]);

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

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (type === 'event') {
        const event = await eventsService.getEventById(parseInt(id!));

        setData({
          id: event.id!,
          title: event.name,
          image_url: event.image_url,
          category_name: event.category_name,
          description: event.description,
          accessibility: event.accessibility,
          location_display: event.location_name || 'Local não especificado',
          organizer: event.organizer,
          latitude: event.latitude,
          longitude: event.longitude,
          infoItems: [
            {
              icon: Calendar,
              label: 'Data Início',
              value: formatDate(event.start_date)
            },
            {
              icon: Clock,
              label: 'Horário',
              value: `${formatTime(event.start_time)} - ${formatTime(event.end_time)}`
            },
            {
              icon: DollarSign,
              label: 'Entrada',
              value: formatPrice(event.price)
            },
            {
              icon: MapPin,
              label: 'Local',
              value: event.location_name || 'Local não especificado'
            }
          ]
        });
      } else {
        const place = await placesService.getTouristSpotById(parseInt(id!));
        const addressDisplay = place.address
          ? `${place.address.street}, ${place.address.number} - ${place.address.city}`
          : 'Endereço não disponível';

        const infoItems = [
          {
            icon: MapPin,
            label: 'Localização',
            value: place.address ? `${place.address.city} - ${place.address.state}` : 'Não especificada'
          }
        ];

        if (place.opening_time && place.closing_time) {
          infoItems.push({
            icon: Clock,
            label: 'Horário',
            value: `${formatTime(place.opening_time)} - ${formatTime(place.closing_time)}`
          });
        }

        // Add extra sections for places
        const extraSections = [];
        if (place.opening_time && place.closing_time) {
          extraSections.push({
            title: 'Horário de Funcionamento',
            content: `${formatTime(place.opening_time)} - ${formatTime(place.closing_time)}`
          });
        }

        setData({
          id: place.id!,
          title: place.name,
          image_url: undefined, // Places usually don't have a main image in the API response shown in previous files, but we can check
          category_name: place.category_name,
          description: place.description,
          accessibility: place.accessibility,
          location_display: addressDisplay,
          organizer: place.organizer,
          latitude: place.address?.latitude,
          longitude: place.address?.longitude,
          infoItems: infoItems,
          extraSections: extraSections
        });
      }

    } catch (err: any) {
      console.error('Error loading item:', err);
      setError(`Falha ao carregar ${type === 'event' ? 'evento' : 'ponto turístico'}. Tente novamente.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setIsLoading(true);
      if (type === 'event') {
        await eventsService.deleteEvent(data!.id);
      } else {
        await placesService.deleteTouristSpot(data!.id);
      }
      navigate(type === 'event' ? '/eventos' : '/pontos-turisticos');
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Erro ao excluir item. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <PageWrapper>
        <Navbar />
        <CenterState>
          <LoaderIcon size={48} />
          <p>Carregando...</p>
        </CenterState>
      </PageWrapper>
    );
  }

  if (error || !data) {
    return (
      <PageWrapper>
        <Navbar />
        <CenterState>
          <AlertTriangle size={48} />
          <h1>Item não encontrado</h1>
          <p>{error || 'O item que você procura não existe ou foi removido.'}</p>
          <BackButton onClick={() => navigate(type === 'event' ? '/eventos' : '/pontos-turisticos')}>
            <ArrowLeft size={18} /> Voltar para {type === 'event' ? 'Eventos' : 'Pontos Turísticos'}
          </BackButton>
        </CenterState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Navbar />

      <HeroSection>
        {data.image_url ? (
          <HeroImage src={data.image_url} alt={data.title} />
        ) : (
          <HeroPlaceholder>
            <MapPin size={64} />
          </HeroPlaceholder>
        )}
        <BackButtonOverlay onClick={() => navigate(type === 'event' ? '/eventos' : '/pontos-turisticos')}>
          <ArrowLeft size={20} />
        </BackButtonOverlay>
      </HeroSection>

      <Container>
        <Header>
          <div>
            {data.category_name && <CategoryBadge>{data.category_name}</CategoryBadge>}
            <Title>{data.title}</Title>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {user && data.organizer === user.id && (
              <>
                <FavoriteButton
                  $active={false}
                  onClick={() => navigate(type === 'event' ? `/eventos/${id}/editar` : `/pontos-turisticos/${id}/editar`)}
                  title="Editar"
                >
                  <Edit size={20} />
                </FavoriteButton>
                <FavoriteButton
                  $active={false}
                  onClick={handleDelete}
                  title="Excluir"
                  style={{ borderColor: '#ef4444', color: '#ef4444' }}
                >
                  <Trash2 size={20} />
                </FavoriteButton>
              </>
            )}
            <FavoriteButton
              $active={isFavorited}
              onClick={toggleFavorite}
              title={isFavorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              disabled={!isAuthenticated}
            >
              <Heart size={24} fill={isFavorited ? 'currentColor' : 'none'} />
            </FavoriteButton>
          </div>
        </Header>

        <InfoGrid>
          {data.infoItems.map((item, index) => (
            <InfoItem key={index}>
              <item.icon size={20} />
              <div>
                <InfoLabel>{item.label}</InfoLabel>
                <InfoValue>{item.value}</InfoValue>
              </div>
            </InfoItem>
          ))}
        </InfoGrid>

        <Section>
          <h2>Sobre</h2>
          <Text>{data.description}</Text>
        </Section>

        {data.extraSections?.map((section, index) => (
          <Section key={index}>
            <h2>{section.title}</h2>
            <Text>{section.content}</Text>
          </Section>
        ))}

        {data.accessibility && (
          <Section>
            <SectionHeader>
              <Accessibility size={20} />
              <h2>Acessibilidade</h2>
            </SectionHeader>
            <Text>{data.accessibility}</Text>
          </Section>
        )}

        <Section>
          <h2>Localização</h2>
          <MapPlaceholder>
            <MapPin size={40} />
            <p>{data.location_display}</p>
          </MapPlaceholder>
        </Section>

        <CtaSection>
          <PrimaryButton onClick={() => {
            // Extract coordinates from the data
            const destinationData = {
              name: data.title,
              description: data.location_display,
              latitude: data.latitude || center[0],
              longitude: data.longitude || center[1]
            };

            navigate('/mapa', { state: { destination: destinationData } });
          }}>
            Como Chegar
          </PrimaryButton>
        </CtaSection>
      </Container>
    </PageWrapper>
  );
}

export default ItemDetailPage;
