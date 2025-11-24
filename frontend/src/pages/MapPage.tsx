import styled, { keyframes } from 'styled-components';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService, type Location } from '@/services/api';
import { routingService, type RouteData } from '@/services/routing';
import { geocodingService, type ReverseGeocodeResult } from '@/services/geocoding';
import AddressSearch from '@/components/map/AddressSearch';
import Navbar from '@/components/Navbar';
import { MapPin, Navigation, X, Clock, Circle, ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';

// --- Leaflet Fix ---
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// --- Animations ---
const slideUp = keyframes`
  from { transform: translate(-50%, 100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// --- Styled Components ---

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow: hidden;
`;

const MapLayout = styled.div`
  display: flex;
  flex: 1;
  height: calc(100vh - 64px);
  background-color: #f5f5f5;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// --- Sidebar ---
const Sidebar = styled.aside`
  width: 380px;
  background-color: #ffffff;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    padding: 1rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
`;

const Header = styled.div`
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin: 0;
  letter-spacing: -0.03em;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0 0 0;
`;

// Route Planner Layout
const RouteInputsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem; 
`;

/* Linha conectora (Timeline) */
const ConnectorLine = styled.div`
  position: absolute;
  left: 15px;
  top: 38px; 
  bottom: 45px;
  width: 2px;
  background-image: linear-gradient(to bottom, #ccc 40%, rgba(255,255,255,0) 0%);
  background-position: right;
  background-size: 2px 6px;
  background-repeat: repeat-y;
  z-index: 0;
`;

// FIX: Adicionado prop $zIndex para controlar a pilha de renderização
const InputRow = styled.div<{ $zIndex?: number }>`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  position: relative;
  z-index: ${props => props.$zIndex || 1}; /* Controla qual input fica por cima */
`;

const IconWrapper = styled.div`
  padding-top: 28px;
  display: flex;
  justify-content: center;
  width: 32px;
  flex-shrink: 0;
`;

const InputGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
`;

const InputLabel = styled.label`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #666;
  letter-spacing: 0.05em;
`;

// Container específico para o AddressSearch para garantir que o dropdown não seja cortado
const SearchWrapper = styled.div`
  position: relative;
  /* Estiliza o input dentro do AddressSearch */
  input {
    width: 100%;
    height: 48px;
    padding: 0 1rem;
    background-color: #f8f9fa;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.95rem;
    color: #1a1a1a;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #d1d5db;
      background-color: #ffffff;
      box-shadow: 0 0 0 2px rgba(0,0,0,0.05);
    }
  }
  
  /* Ajusta a lista de resultados do AddressSearch se necessário */
  ul, .results-container {
    z-index: 1000 !important;
    border-radius: 8px;
    margin-top: 4px;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
  }
`;

const StyledWaypointButton = styled.button`
  width: 100%;
  height: 48px;
  padding: 0 1rem;
  background-color: #f8f9fa;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1a1a1a;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    border-color: #d1d5db;
    background-color: #ffffff;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #374151;
  }
  
  span.placeholder {
    color: #9ca3af;
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  max-height: 240px;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border-bottom: 1px solid #f3f4f6;
  transition: background 0.2s;

  &:hover { background-color: #f9fafb; }
  &:last-child { border-bottom: none; }

  strong { font-size: 0.9rem; color: #1a1a1a; font-weight: 600; }
  span { font-size: 0.8rem; color: #6b7280; }
`;

const CalculateBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem;
  background: #1a1a1a;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-top: auto; 

  &:hover:not(:disabled) {
    background: #000;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: #4b5563;
  }
`;

// Floating Info Card
const FloatingInfoCard = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 420px;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: ${slideUp} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  border: 1px solid #f3f4f6;
`;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
  
  h3 { margin: 0; font-size: 1.1rem; color: #1a1a1a; font-weight: 700; }
`;

const CloseInfoBtn = styled.button`
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
  
  &:hover { background: #e5e7eb; color: #1a1a1a; }
`;

const InfoStats = styled.div`
  display: flex;
  gap: 2rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a1a1a;
  }
  
  div {
    display: flex;
    flex-direction: column;
    span:first-child { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
    span:last-child { font-size: 1.1rem; font-weight: 700; color: #1a1a1a; }
  }
`;

// Map Container
const MapWrapper = styled.div`
  flex: 1;
  position: relative;
  z-index: 1;
  
  .leaflet-container {
    width: 100%;
    height: 100%;
    background-color: #e5e5e5;
  }
`;

// Popup & Modals
const CustomPopup = styled.div`
  min-width: 200px;
  h4 { margin: 0 0 0.5rem 0; color: #1a1a1a; font-weight: 700; }
  p { margin: 0 0 1rem 0; color: #666; font-size: 0.85rem; }
`;

const PopupActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const PopupBtn = styled.button`
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover { background: #000; }
  
  &.secondary {
    background: #ffffff;
    color: #1a1a1a;
    border: 1px solid #d1d5db;
    &:hover { background: #f9fafb; }
  }
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid rgba(0,0,0,0.1);
  border-top-color: #141414;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const FullPageLoading = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #141414;
  color: white;
  gap: 1rem;
`;

// --- Component ---

export default function MapPage() {
  const locationState = useLocation();
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  const [locations, setLocations] = useState<Location[]>([]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  const [isDestDropdownOpen, setIsDestDropdownOpen] = useState(false);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [clickedLocation, setClickedLocation] = useState<ReverseGeocodeResult | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const center: [number, number] = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT || '-7.0227'),
    parseFloat(import.meta.env.VITE_MAP_CENTER_LNG || '-37.2744')
  ];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Handle incoming destination from other pages
  useEffect(() => {
    if (locationState.state?.destination) {
      const destData = locationState.state.destination;
      setDestination({
        id: Date.now(),
        name: destData.name,
        description: destData.description,
        latitude: destData.latitude,
        longitude: destData.longitude,
        created_at: new Date().toISOString()
      });

      // Optional: Clear state to avoid re-setting on refresh (though react-router state persists)
      // window.history.replaceState({}, document.title);
    }
  }, [locationState.state]);

  function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
      click: (e) => onMapClick(e.latlng.lat, e.latlng.lng),
    });
    return null;
  }

  const handleMapClick = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const addressData = await geocodingService.reverseGeocode(lat, lng);
      if (addressData) setClickedLocation(addressData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleSetLocationFromMap = (type: 'origin' | 'dest') => {
    if (!clickedLocation) return;

    const newLoc: Location = {
      id: Date.now(),
      name: clickedLocation.display_name.split(',')[0].trim(),
      description: clickedLocation.display_name,
      latitude: parseFloat(clickedLocation.lat),
      longitude: parseFloat(clickedLocation.lon),
      created_at: new Date().toISOString()
    };

    if (type === 'origin') setOrigin(newLoc);
    else setDestination(newLoc);

    setClickedLocation(null);
  };

  const handleCalculate = async () => {
    if (!origin || !destination) return;

    setLoadingRoute(true);
    try {
      const route = await routingService.calculateRoute({
        coordinates: [
          { lat: origin.latitude, lon: origin.longitude },
          { lat: destination.latitude, lon: destination.longitude }
        ]
      });
      setRouteData(route);
    } catch (error) {
      console.error('Erro rota', error);
      alert('Não foi possível calcular a rota. Tente pontos mais próximos ou em estradas conhecidas.');
    } finally {
      setLoadingRoute(false);
    }
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (pageLoading) {
    return (
      <FullPageLoading>
        <Spinner style={{ borderColor: 'rgba(255,255,255,0.2)', borderTopColor: 'white' }} />
        <p style={{ fontSize: '0.9rem' }}>Carregando mapa...</p>
      </FullPageLoading>
    );
  }

  return (
    <PageWrapper>
      <Navbar />

      <MapLayout>
        <Sidebar>
          <Header>
            <Title>Planejar Rota</Title>
            <Subtitle>Insira os locais para calcular o trajeto</Subtitle>
          </Header>

          <RouteInputsContainer>
            {/* Linha Conectora Visual */}
            <ConnectorLine />

            {/* Origem (Z-Index MAIOR para ficar por cima) */}
            <InputRow $zIndex={20}>
              <IconWrapper>
                <Circle size={16} color="#16a34a" fill="#16a34a" />
              </IconWrapper>

              <InputGroup>
                <InputLabel>Ponto de Partida</InputLabel>
                <SearchWrapper>
                  {origin ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 1rem',
                      height: '48px',
                      background: '#e8f5e9',
                      border: '1px solid #4caf50',
                      borderRadius: '8px',
                      color: '#2e7d32',
                      fontSize: '0.95rem'
                    }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{origin.name}</span>
                      <button onClick={() => { setOrigin(null); setRouteData(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', display: 'flex' }}>
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <AddressSearch
                      placeholder="Digite o endereço de partida..."
                      city="Patos"
                      onLocationSelect={(result) => {
                        setOrigin({
                          id: Date.now(),
                          name: result.display_name.split(',')[0].trim(),
                          description: result.display_name,
                          latitude: parseFloat(result.lat),
                          longitude: parseFloat(result.lon),
                          created_at: new Date().toISOString()
                        });
                      }}
                    />
                  )}
                </SearchWrapper>
              </InputGroup>
            </InputRow>

            {/* Destino (Z-Index MENOR para ficar por baixo) */}
            <InputRow $zIndex={10}>
              <IconWrapper>
                <MapPin size={20} color="#dc2626" fill="#dc2626" />
              </IconWrapper>

              <InputGroup>
                <InputLabel>Destino</InputLabel>
                <div style={{ position: 'relative' }}>
                  <StyledWaypointButton onClick={() => setIsDestDropdownOpen(!isDestDropdownOpen)}>
                    {destination ? (
                      <>
                        <span>{destination.name}</span>
                        <div role="button" onClick={(e) => { e.stopPropagation(); setDestination(null); setRouteData(null); }} style={{ display: 'flex', marginLeft: 'auto' }}>
                          <X size={18} color="#6b7280" />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="placeholder">Selecione o destino...</span>
                        <ChevronDown size={16} color="#9ca3af" />
                      </>
                    )}
                  </StyledWaypointButton>

                  {isDestDropdownOpen && (
                    <DropdownList>
                      {locations.map(loc => (
                        <DropdownItem key={loc.id} onClick={() => { setDestination(loc); setIsDestDropdownOpen(false); }}>
                          <strong>{loc.name}</strong>
                          <span>{loc.description?.substring(0, 35)}...</span>
                        </DropdownItem>
                      ))}
                    </DropdownList>
                  )}
                </div>
              </InputGroup>
            </InputRow>
          </RouteInputsContainer>

          <CalculateBtn onClick={handleCalculate} disabled={!origin || !destination || loadingRoute}>
            {loadingRoute ? (
              <>Calculando...</>
            ) : (
              <>
                <Navigation size={18} /> Traçar Rota
              </>
            )}
          </CalculateBtn>
        </Sidebar>

        <MapWrapper>
          <MapContainer center={center} zoom={14} style={{ width: '100%', height: '100%' }} zoomControl={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='© OpenStreetMap contributors'
            />
            <MapClickHandler onMapClick={handleMapClick} />

            {origin && (
              <Marker position={[origin.latitude, origin.longitude]} icon={new Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}>
                <Popup>{origin.name}</Popup>
              </Marker>
            )}

            {destination && (
              <Marker position={[destination.latitude, destination.longitude]} icon={new Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
              })}>
                <Popup>{destination.name}</Popup>
              </Marker>
            )}

            {clickedLocation && (
              <Marker position={[parseFloat(clickedLocation.lat), parseFloat(clickedLocation.lon)]}>
                <Popup>
                  <CustomPopup>
                    <h4>Local Selecionado</h4>
                    <p>{clickedLocation.display_name.split(',')[0]}</p>
                    <PopupActions>
                      <PopupBtn onClick={() => handleSetLocationFromMap('origin')}>
                        Definir como Partida
                      </PopupBtn>
                      <PopupBtn className="secondary" onClick={() => handleSetLocationFromMap('dest')}>
                        Definir como Destino
                      </PopupBtn>
                    </PopupActions>
                  </CustomPopup>
                </Popup>
              </Marker>
            )}

            {routeData && (
              <Polyline
                positions={routeData.geometry.map(coord => [coord[1], coord[0]])}
                color="#1a1a1a"
                weight={5}
                opacity={0.8}
              />
            )}
          </MapContainer>

          {loadingAddress && (
            <div style={{ position: 'absolute', top: 20, right: 20, background: 'white', padding: '12px 20px', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', display: 'flex', gap: 10, alignItems: 'center', zIndex: 1000 }}>
              <Spinner style={{ width: 18, height: 18, borderWidth: 2 }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500, color: '#333' }}>Identificando local...</span>
            </div>
          )}

          {routeData && (
            <FloatingInfoCard>
              <InfoHeader>
                <h3>Resumo do Trajeto</h3>
                <CloseInfoBtn onClick={() => setRouteData(null)}><X size={20} /></CloseInfoBtn>
              </InfoHeader>

              <InfoStats>
                <StatItem>
                  <div className="icon-box"><Navigation size={20} /></div>
                  <div>
                    <span>Distância</span>
                    <span>{formatDistance(routeData.distance)}</span>
                  </div>
                </StatItem>
                <StatItem>
                  <div className="icon-box"><Clock size={20} /></div>
                  <div>
                    <span>Tempo</span>
                    <span>{formatDuration(routeData.duration)}</span>
                  </div>
                </StatItem>
              </InfoStats>
            </FloatingInfoCard>
          )}
        </MapWrapper>
      </MapLayout>
    </PageWrapper>
  );
}