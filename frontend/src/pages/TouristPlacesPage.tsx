import styled from 'styled-components';
import { MapPin, Search, Plus, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { placesService, type TouristSpotListItem } from '@/services/places';
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
    border-color: #141414;
  }

  &:focus {
    outline: none;
    border-color: #141414;
    box-shadow: 0 0 0 2px rgba(20, 20, 20, 0.1);
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

function TouristPlacesPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [places, setPlaces] = useState<TouristSpotListItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['Todas Categorias']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas Categorias');
  const [selectedLocation, setSelectedLocation] = useState('Todas Regiões');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locations = ['Todas Regiões', 'Patos - PB', 'Região Metropolitana'];

  useEffect(() => {
    loadPlaces();
    loadCategories();
  }, []);

  const loadPlaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await placesService.getTouristSpots();
      setPlaces(data);
    } catch (err: any) {
      setError('Falha ao carregar pontos turísticos. Tente novamente.');
      console.error('Error loading places:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await placesService.getCategories();
      const categoryNames = data.map(cat => cat.name);
      setCategories(['Todas Categorias', ...categoryNames]);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todas Categorias' || place.category_name === selectedCategory;
    const matchesLocation = selectedLocation === 'Todas Regiões' || place.location?.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  const handleCreatePlace = () => {
    if (!isAuthenticated) {
      navigate('/entrar');
      return;
    }
    navigate('/pontos-turisticos/criar');
  };

  // Place Card Component
  const PlaceCard = ({ place }: { place: TouristSpotListItem }) => {

    return (
      <Card 
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
            {place.location || 'Localização não especificada'}
          </Card.MetaItem>
        </Card.Meta>
        
        <Card.Action onClick={() => navigate(`/pontos-turisticos/${place.id}`)}>
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
              <HeaderTitle>Pontos Turísticos</HeaderTitle>
              <HeaderSubtitle>
                {filteredPlaces.length} Locais Encontrados
              </HeaderSubtitle>
            </div>
            <CreateButton onClick={handleCreatePlace}>
              <Plus size={20} />
              Criar Ponto Turístico
            </CreateButton>
          </HeaderContent>
        </HeaderContainer>
      </HeaderSection>

      <FiltersSection>
        <FiltersContainer>
          
          <SearchBox>
            <Search size={18} color="#999" />
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
              <EmptyText>Carregando pontos turísticos...</EmptyText>
            </EmptyState>
          ) : error ? (
            <EmptyState>
              <EmptyText>{error}</EmptyText>
            </EmptyState>
          ) : (
            <>
              <CardsGrid>
                {filteredPlaces.map(place => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </CardsGrid>

              {filteredPlaces.length === 0 && !isLoading && (
                <EmptyState>
                   <Search size={48} color="#d1d5db" style={{ marginBottom: '1rem' }} />
                   <EmptyText>Nenhum ponto turístico encontrado com os filtros selecionados.</EmptyText>
                </EmptyState>
              )}
            </>
          )}
        </ContentContainer>
      </ContentSection>
    </PageWrapper>
  );
}

export default TouristPlacesPage;