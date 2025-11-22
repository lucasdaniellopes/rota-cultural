import styled, { keyframes, css } from 'styled-components';
import { Heart, MapPin, Calendar, Clock, ArrowRight, AlertTriangle, Loader, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { favoritesService, type Favorite } from '@/services/favorites';
import { eventsService, type Event } from '@/services/events';
import { placesService, type TouristSpotListItem } from '@/services/places';

// --- Interfaces ---
interface FavoriteItem extends Favorite {
  title?: string;
  image?: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  type?: 'event' | 'place';
  eventData?: Event;
  placeData?: TouristSpotListItem;
}

// --- Animations ---
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f9fafb;
  font-family: 'Inter', sans-serif;
  color: #141414;
`;

// Header
const HeaderSection = styled.header`
  background-color: #ffffff;
  padding: 3rem 1.5rem 2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeaderIconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background-color: rgba(239, 68, 68, 0.1); /* Vermelho bem suave */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    color: #ef4444;
    fill: #ef4444;
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #141414;
  margin: 0 0 0.5rem 0;
`;

const PageSubtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0;
`;

// Filters / Tabs
const FilterBar = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const FilterContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  
  &::-webkit-scrollbar { height: 0px; } /* Hide scrollbar */
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  border: 1px solid;

  ${props => props.$active ? css`
    background-color: #141414;
    color: #ffffff;
    border-color: #141414;
  ` : css`
    background-color: transparent;
    color: #6b7280;
    border-color: #e5e7eb;

    &:hover {
      border-color: #9ca3af;
      color: #141414;
    }
  `}
`;

// Content Area
const ContentSection = styled.main`
  padding: 3rem 1.5rem;
  min-height: 60vh;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// Cards Grid
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

// Dark Card
const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    border-color: #d1d5db;
  }
`;

const CardImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$src});
  background-size: cover;
  background-position: center;
  position: relative;
`;

const CardBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0,0,0,0.7);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0,0,0,0.6);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #ef4444; /* Red */
  transition: all 0.2s;
  backdrop-filter: blur(4px);

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    transform: scale(1.1);
  }
  
  svg {
    fill: #ef4444;
  }
`;

const CardBody = styled.div`
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #141414;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const CardDescription = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const MetaList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.85rem;

  svg {
    color: #9ca3af;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #141414;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #333;
  }
`;

// States
const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: #6b7280;
  gap: 1rem;
`;

const Spinner = styled(Loader)`
  animation: ${spin} 1s linear infinite;
  color: #141414;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  background: #ffffff;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  padding: 3rem;
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  color: #141414;
  margin: 1rem 0 0.5rem 0;
`;

const EmptyText = styled.p`
  color: #6b7280;
  max-width: 400px;
  margin-bottom: 2rem;
`;

const ExploreButton = styled.button`
  padding: 0.75rem 2rem;
  background-color: #141414;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    background-color: #333;
  }
`;

// --- Logic ---

function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'places' | 'events'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const favs = await favoritesService.getFavorites();
      
      // Enrich favorites with full object data
      const enrichedFavs = await Promise.all(
        favs.map(async (fav) => {
          try {
            if (fav.favoritable_type === 'event') {
              const eventData = await eventsService.getEventById(fav.object_id);
              return {
                ...fav,
                title: eventData.name,
                image: eventData.image_url || '/event-placeholder.jpg',
                description: eventData.description,
                location: eventData.location_name || 'Local não especificado',
                date: new Date(eventData.start_date).toLocaleDateString('pt-BR'),
                time: eventData.start_time.slice(0, 5),
                eventData,
                type: 'event' as const,
              };
            } else if (fav.favoritable_type === 'touristspot') {
              const placeData = await placesService.getTouristSpotById(fav.object_id);
              return {
                ...fav,
                title: placeData.name,
                image: placeData.image_url || '/default-place.png',
                description: placeData.description,
                location: placeData.location || 'Localização não especificada',
                placeData,
                type: 'place' as const,
              };
            }
            return fav as FavoriteItem;
          } catch (err) {
            console.error(`Error loading favorite ${fav.id}:`, err);
            return fav as FavoriteItem;
          }
        })
      );

      setFavorites(enrichedFavs);
    } catch (err: any) {
      setError('Falha ao carregar favoritos. Tente novamente.');
      console.error('Error loading favorites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja remover este item dos favoritos?')) return;
    
    try {
      await favoritesService.removeFavorite(id);
      setFavorites(favorites.filter(fav => fav.id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const filteredFavorites = favorites.filter(fav => {
    if (activeTab === 'all') return true;
    if (activeTab === 'places') return fav.type === 'place';
    if (activeTab === 'events') return fav.type === 'event';
    return true;
  });

  const placesCount = favorites.filter(f => f.type === 'place').length;
  const eventsCount = favorites.filter(f => f.type === 'event').length;

  return (
    <PageWrapper>
      <Navbar />
      
      <HeaderSection>
        <HeaderContainer>
          <HeaderIconWrapper>
            <Heart size={32} />
          </HeaderIconWrapper>
          <HeaderContent>
            <PageTitle>Meus Favoritos</PageTitle>
            <PageSubtitle>
              Gerencie os eventos e locais que você salvou.
            </PageSubtitle>
          </HeaderContent>
        </HeaderContainer>
      </HeaderSection>

      <FilterBar>
        <FilterContainer>
          <TabButton 
            $active={activeTab === 'all'} 
            onClick={() => setActiveTab('all')}
          >
            Todos ({favorites.length})
          </TabButton>
          <TabButton 
            $active={activeTab === 'places'} 
            onClick={() => setActiveTab('places')}
          >
            Pontos Turísticos ({placesCount})
          </TabButton>
          <TabButton 
            $active={activeTab === 'events'} 
            onClick={() => setActiveTab('events')}
          >
            Eventos ({eventsCount})
          </TabButton>
        </FilterContainer>
      </FilterBar>

      <ContentSection>
        <ContentContainer>
          {isLoading ? (
            <LoadingState>
              <Spinner size={40} />
              <p>Carregando seus favoritos...</p>
            </LoadingState>
          ) : error ? (
            <LoadingState>
              <AlertTriangle size={40} color="#ef4444" />
              <p>{error}</p>
            </LoadingState>
          ) : filteredFavorites.length === 0 ? (
            <EmptyState>
              <Heart size={64} color="#444" />
              <EmptyTitle>
                {activeTab === 'all' ? 'Nenhum favorito ainda' : 
                 activeTab === 'places' ? 'Nenhum local salvo' : 'Nenhum evento salvo'}
              </EmptyTitle>
              <EmptyText>
                Explore a plataforma para encontrar eventos incríveis e pontos turísticos inesquecíveis.
              </EmptyText>
              <ExploreButton 
                onClick={() => navigate(activeTab === 'events' ? '/eventos' : '/pontos-turisticos')}
              >
                Explorar {activeTab === 'events' ? 'Eventos' : 'Destinos'}
              </ExploreButton>
            </EmptyState>
          ) : (
            <Grid>
              {filteredFavorites.map(favorite => (
                <Card key={favorite.id}>
                  <CardImage $src={favorite.image || '/default-place.png'}>
                    <CardBadge>
                      {favorite.type === 'event' ? 'Evento' : 'Ponto Turístico'}
                    </CardBadge>
                    <RemoveButton 
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      title="Remover"
                    >
                      <Trash2 size={18} />
                    </RemoveButton>
                  </CardImage>
                  
                  <CardBody>
                    <CardTitle>{favorite.title}</CardTitle>
                    <CardDescription>{favorite.description}</CardDescription>
                    
                    <MetaList>
                      <MetaItem>
                        <MapPin size={14} /> {favorite.location}
                      </MetaItem>
                      {favorite.date && (
                        <MetaItem>
                          <Calendar size={14} /> {favorite.date}
                        </MetaItem>
                      )}
                      {favorite.time && (
                        <MetaItem>
                          <Clock size={14} /> {favorite.time}
                        </MetaItem>
                      )}
                    </MetaList>

                    <ActionButton
                      onClick={() =>
                        navigate(
                          favorite.type === 'event'
                            ? `/eventos/${favorite.object_id}`
                            : `/pontos-turisticos/${favorite.object_id}`
                        )
                      }
                    >
                      Ver Detalhes <ArrowRight size={16} />
                    </ActionButton>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </ContentContainer>
      </ContentSection>
    </PageWrapper>
  );
}

export default FavoritesPage;