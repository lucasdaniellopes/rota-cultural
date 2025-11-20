import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { locationService, type Location } from '@/services/api';
import { routingService, type RouteData } from '@/services/routing';
import { geocodingService, type NominatimResult, type ReverseGeocodeResult } from '@/services/geocoding';
import AddressSearch from '@/components/map/AddressSearch';
import Navbar from '@/components/Navbar';
import { Plus, X, MapPin, Navigation, Search } from 'lucide-react';
import styles from '@/styles/MapPage.module.css';

// Configure o ícone padrão do Leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface Waypoint {
  location: Location | null;
  label: string;
}

export default function MapPage() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { location: null, label: 'Localização' },
    { location: null, label: 'Destino' }
  ]);
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeDistance, setRouteDistance] = useState<string | null>(null);
  const [activeWaypointMenu, setActiveWaypointMenu] = useState<number | null>(null);
  const [showAddressSearch, setShowAddressSearch] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<ReverseGeocodeResult | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  const center: [number, number] = [
    parseFloat(import.meta.env.VITE_MAP_CENTER_LAT),
    parseFloat(import.meta.env.VITE_MAP_CENTER_LNG)
  ];

  function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
      click: (e) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  }

  const handleWaypointChange = (index: number, location: Location) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = { ...newWaypoints[index], location };
    setWaypoints(newWaypoints);
    setActiveWaypointMenu(null);
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setLoadingAddress(true);
    try {
      const addressData = await geocodingService.reverseGeocode(lat, lng);
      if (addressData) {
        setClickedLocation(addressData);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleAddressSearchSelect = (result: NominatimResult) => {

    const newLocation: Location = {
      id: Date.now(), 
      name: result.display_name.split(',')[0].trim(),
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      description: `Adicionado via busca: ${result.display_name}`
    };
   
    setLocations(prev => [...prev, newLocation]);

    const emptyIndex = waypoints.findIndex(wp => wp.location === null);
    if (emptyIndex !== -1) {
      const newWaypoints = [...waypoints];
      newWaypoints[emptyIndex] = { ...newWaypoints[emptyIndex], location: newLocation };
      setWaypoints(newWaypoints);
    } else {
      const newLabel = `Parada ${waypoints.length - 1}`;
      setWaypoints([...waypoints, { location: newLocation, label: newLabel }]);
    }
  };

  const addClickedLocationToWaypoint = () => {
    if (!clickedLocation) return;

    const newLocation: Location = {
      id: Date.now(),
      name: clickedLocation.display_name.split(',')[0].trim(),
      latitude: parseFloat(clickedLocation.lat),
      longitude: parseFloat(clickedLocation.lon),
      description: clickedLocation.display_name
    };

    setLocations(prev => [...prev, newLocation]);

    const emptyIndex = waypoints.findIndex(wp => wp.location === null);
    if (emptyIndex !== -1) {
      const newWaypoints = [...waypoints];
      newWaypoints[emptyIndex] = { ...newWaypoints[emptyIndex], location: newLocation };
      setWaypoints(newWaypoints);
    } else {
      const newLabel = `Parada ${waypoints.length - 1}`;
      setWaypoints([...waypoints, { location: newLocation, label: newLabel }]);
    }

    setClickedLocation(null);
  };

  const addWaypoint = () => {
    const newLabel = `Parada ${waypoints.length - 1}`;
    setWaypoints([...waypoints, { location: null, label: newLabel }]);
  };

  const removeWaypoint = (index: number) => {
    if (waypoints.length > 2) {
      const newWaypoints = waypoints.filter((_, i) => i !== index);
      setWaypoints(newWaypoints);
      setRouteData(null);
    }
  };

  const calculateRoute = async () => {
    const validWaypoints = waypoints.filter(wp => wp.location !== null);
    if (validWaypoints.length < 2) return;

    const waypointIds = validWaypoints.map(wp => wp.location!.id);

    setLoadingRoute(true);
    try {
      const route = await routingService.calculateRoute({ waypointIds });
      setRouteData(route);
      
      // Calcular distância aproximada
      if (route.distance) {
        const distanceKm = (route.distance / 1000).toFixed(2);
        setRouteDistance(`${distanceKm} km`);
      }
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
    } finally {
      setLoadingRoute(false);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await locationService.getLocations();
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Erro ao carregar localizações');
        console.error(err);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}></div>
        <p>Carregando mapa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['error-container']}>
        <p>{error}</p>
      </div>
    );
  }

  const isRouteValid = waypoints.every(wp => wp.location !== null);

  return (
    <div>
      <Navbar isAuthenticated={true} />
      
      <div className={styles['map-container']}>
        <div className={styles['sidebar']}>
          <div className={styles['sidebar-content']}>
            <h2 className={styles['sidebar-title']}>Planeje sua Rota</h2>
            <p className={styles['sidebar-subtitle']}>Selecione seus locais e calcule a melhor rota</p>

            <div className={styles['waypoints-section']}>
              {waypoints.map((waypoint, index) => (
                <div key={index} className={styles['waypoint-item']}>
                  <div className={styles['waypoint-label']}>
                    <MapPin size={16} />
                    <span>{waypoint.label}</span>
                  </div>

                  <div className={styles['waypoint-select-container']}>
                    <button
                      className={styles['waypoint-button']}
                      onClick={() => setActiveWaypointMenu(activeWaypointMenu === index ? null : index)}
                    >
                      {waypoint.location ? waypoint.location.name : 'Selecionar local'}
                    </button>

                    {activeWaypointMenu === index && (
                      <div className={styles['waypoint-dropdown']}>
                        {locations.map(location => (
                          <button
                            key={location.id}
                            className={styles['dropdown-item']}
                            onClick={() => handleWaypointChange(index, location)}
                          >
                            <MapPin size={14} />
                            <div className={styles['dropdown-item-content']}>
                              <div className={styles['dropdown-item-name']}>{location.name}</div>
                              <div className={styles['dropdown-item-desc']}>{location.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {waypoints.length > 2 && index > 0 && index < waypoints.length - 1 && (
                    <button
                      className={styles['remove-waypoint-btn']}
                      onClick={() => removeWaypoint(index)}
                      title="Remover parada"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              className={styles['add-waypoint-btn']}
              onClick={addWaypoint}
            >
              <Plus size={18} />
              Adicionar Parada
            </button>

            <div className={styles['address-search-section']}>
              <button
                className={styles['toggle-search-btn']}
                onClick={() => setShowAddressSearch(!showAddressSearch)}
              >
                <Search size={18} />
                {showAddressSearch ? 'Ocultar Busca' : 'Buscar Endereço'}
              </button>

              {showAddressSearch && (
                <div className={styles['address-search-container']}>
                  <AddressSearch
                    onLocationSelect={handleAddressSearchSelect}
                    placeholder="Buscar lugares turísticos, endereços..."
                    city="Patos"
                  />
                </div>
              )}
            </div>

            <button
              className={styles['calculate-btn']}
              onClick={calculateRoute}
              disabled={!isRouteValid || loadingRoute}
            >
              <Navigation size={18} />
              {loadingRoute ? 'Calculando...' : 'Calcular Rota'}
            </button>

            {routeData && routeDistance && (
              <div className={styles['route-info']}>
                <h3 className={styles['route-info-title']}>Informações da Rota</h3>
                <div className={styles['route-info-item']}>
                  <span className={styles['route-label']}>Distância:</span>
                  <span className={styles['route-value']}>{routeDistance}</span>
                </div>
                <div className={styles['route-info-item']}>
                  <span className={styles['route-label']}>Pontos:</span>
                  <span className={styles['route-value']}>{waypoints.filter(wp => wp.location).length}</span>
                </div>
              </div>
            )}

            <div className={styles['legend']}>
              <h3 className={styles['legend-title']}>Legenda</h3>
              <div className={styles['legend-item']}>
                <div className={`${styles['legend-color']} ${styles['origin']}`}></div>
                <span>Localização</span>
              </div>
              <div className={styles['legend-item']}>
                <div className={`${styles['legend-color']} ${styles['destination']}`}></div>
                <span>Destino</span>
              </div>
              <div className={styles['legend-item']}>
                <div className={`${styles['legend-color']} ${styles['route']}`}></div>
                <span>Rota</span>
              </div>
            </div>
          </div>
        </div>

        <MapContainer center={center} zoom={parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM)} className={styles['map']}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {waypoints.map((waypoint, index) => {
            if (!waypoint.location) return null;

            const isFirst = index === 0;
            const isLast = index === waypoints.length - 1;
            const customIcon = new Icon({
              iconUrl: isFirst 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                : isLast
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });

            return (
              <Marker
                key={`${waypoint.location.id}-${index}`}
                position={[Number(waypoint.location.latitude), Number(waypoint.location.longitude)]}
                icon={customIcon}
              >
                <Popup>
                  <div className={styles['popup-content']}>
                    <h4 className={styles['popup-title']}>{waypoint.location.name}</h4>
                    <p className={styles['popup-description']}>{waypoint.location.description}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {clickedLocation && (
            <Marker
              position={[parseFloat(clickedLocation.lat), parseFloat(clickedLocation.lon)]}
            >
              <Popup>
                <div className={styles['popup-content']}>
                  <h4>{clickedLocation.display_name.split(',')[0].trim()}</h4>
                  <p>{clickedLocation.display_name}</p>
                  <button
                    onClick={addClickedLocationToWaypoint}
                    className={styles['add-to-route-btn']}
                  >
                    Adicionar à Rota
                  </button>
                </div>
              </Popup>
            </Marker>
          )}

          {routeData && (
            <Polyline
              positions={routeData.geometry.map((coord: [number, number]) => [coord[1], coord[0]])}
              color="#0052cc"
              weight={5}
              opacity={0.7}
              dashArray="5, 5"
            />
          )}

          {loadingAddress && (
            <div className={styles['loading-overlay']}>
              <div className={styles['loading-spinner']}></div>
              <p>Buscando endereço...</p>
            </div>
          )}
        </MapContainer>

        {/* Location Modal */}
        {clickedLocation && (
          <div className={styles['location-modal-overlay']}>
            <div className={styles['location-modal']}>
              <div className={styles['location-modal-header']}>
                <h4>Local Selecionado</h4>
                <button
                  onClick={() => setClickedLocation(null)}
                  className={styles['modal-close-btn']}
                >
                  ×
                </button>
              </div>
              <div className={styles['location-modal-content']}>
                <p className={styles['modal-location-name']}>
                  {clickedLocation.display_name.split(',')[0].trim()}
                </p>
                <p className={styles['modal-location-address']}>
                  {clickedLocation.display_name}
                </p>
                <button
                  onClick={addClickedLocationToWaypoint}
                  className={styles['modal-add-btn']}
                >
                  Adicionar à Rota
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}