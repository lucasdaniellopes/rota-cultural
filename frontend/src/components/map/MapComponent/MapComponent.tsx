import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents} from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {locationService, type Location} from '@/services/api'
import {routingService, type RouteData} from '@/services/routing'
import {geocodingService, type ReverseGeocodeResult} from '@/services/geocoding'
import DestinationSelector from '../DestinationSelector'
import AddressSearch from '../AddressSearch'
import styles from './MapComponent.module.css';

// Configure o ícone padrão do Leaflet para corrigir o problema dos marcadores
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

// Component for handling map clicks and reverse geocoding
function MapClickHandler({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
}

export default function MapComponent() {
    const [waypoints, setWaypoints] = useState<(Location | null)[]>([null, null])
    const [routeData, setRouteData] = useState<RouteData | null>(null)
    const [loadingRoute, setLoadingRoute] = useState(false)
    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [clickedLocation, setClickedLocation] = useState<ReverseGeocodeResult | null>(null)
    const [loadingAddress, setLoadingAddress] = useState(false)
    const [showAddressSearch, setShowAddressSearch] = useState(false)
    const center: [number,number] = [-7.026368, -37.277010] // Centro de Patos

    const handlewaypointChange = (index: number, locationId: string) => {
        const location = locations.find(loc => loc.id === Number(locationId))
        if (location) {
            const newWaypoints = [...waypoints]
            newWaypoints[index] = location
            setWaypoints(newWaypoints)
        }
    }

    const addWaypoint = () => {
        setWaypoints([...waypoints, null])
    }

    const removeWaypoint = (index: number) => {
        const newWaypoints = waypoints.filter((_, i) => i !== index)
        setWaypoints(newWaypoints)
    }

    const handleMapClick = async (lat: number, lng: number) => {
        setLoadingAddress(true)
        try {
            const addressData = await geocodingService.reverseGeocode(lat, lng)
            if (addressData) {
                setClickedLocation(addressData)
            }
        } catch (error) {
            console.error('Reverse geocoding error:', error)
        } finally {
            setLoadingAddress(false)
        }
    }

    const handleAddressSearchSelect = (result: any) => {
        // Convert Nominatim result to Location format and add to waypoints
        const newLocation: Location = {
            id: Date.now(), // Temporary ID for Nominatim results
            name: result.display_name.split(',')[0].trim(),
            latitude: parseFloat(result.lat),
            longitude: parseFloat(result.lon),
            description: `Adicionado via Nominatim: ${result.display_name}`
        }

        // Add to existing locations list
        setLocations(prev => [...prev, newLocation])

        // Find first empty waypoint slot and add the location
        const emptyIndex = waypoints.findIndex(wp => wp === null)
        if (emptyIndex !== -1) {
            const newWaypoints = [...waypoints]
            newWaypoints[emptyIndex] = newLocation
            setWaypoints(newWaypoints)
        } else {
            setWaypoints([...waypoints, newLocation])
        }

        setShowAddressSearch(false)
    }

    const addClickedLocationToWaypoint = () => {
        if (!clickedLocation) return

        const newLocation: Location = {
            id: Date.now(),
            name: clickedLocation.display_name.split(',')[0].trim(),
            latitude: parseFloat(clickedLocation.lat),
            longitude: parseFloat(clickedLocation.lon),
            description: clickedLocation.display_name
        }

        setLocations(prev => [...prev, newLocation])

        const emptyIndex = waypoints.findIndex(wp => wp === null)
        if (emptyIndex !== -1) {
            const newWaypoints = [...waypoints]
            newWaypoints[emptyIndex] = newLocation
            setWaypoints(newWaypoints)
        } else {
            setWaypoints([...waypoints, newLocation])
        }

        setClickedLocation(null)
    }

    const calculateRoute = async () => {
        if (waypoints.length < 2 || waypoints.some(waypoint => !waypoint)) return

        const waypointIds = waypoints.filter(waypoint => waypoint !== null).map(waypoint => waypoint.id)

        setLoadingRoute(true)
        try {
            const route = await routingService.calculateRoute({ waypointIds })
            setRouteData(route)
        } catch (error) {
            console.error('Erro ao calcular rota:', error)
        } finally {
            setLoadingRoute(false)
        }
    }

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await locationService.getLocations()
                setLocations(data)
            } catch (err) {
                setError('Erro ao carregar localizações')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchLocations()
    }, [])

    if (loading) {
        return (
            <div className={styles['loading-container']}>
                <p>Carregando mapa...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles['error-container']}>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <div className={styles['map-component-container']}>
            <DestinationSelector
                waypoints={waypoints}
                locations={locations}
                onWaypointChange={handlewaypointChange}
                onAddWaypoint={addWaypoint}
                onRemoveWaypoint={removeWaypoint}
                onCalculateRoute={calculateRoute}
                loadingRoute={loadingRoute}
            />

            {/* Address Search Component */}
            <div className={styles['address-search-wrapper']}>
                <AddressSearch
                    onLocationSelect={handleAddressSearchSelect}
                    placeholder="Buscar lugares turísticos, endereços..."
                    city="Patos"
                />
                <button
                    onClick={() => setShowAddressSearch(!showAddressSearch)}
                    className={styles['toggle-search-btn']}
                >
                    {showAddressSearch ? 'Ocultar Busca' : 'Mostrar Busca'}
                </button>
            </div>

            {/* Clicked Location Info */}
            {clickedLocation && (
                <div className={styles['clicked-location-info']}>
                    <div className={styles['location-info-header']}>
                        <h4>Local Selecionado</h4>
                        <button
                            onClick={() => setClickedLocation(null)}
                            className={styles['close-info-btn']}
                        >
                            ×
                        </button>
                    </div>
                    <div className={styles['location-info-content']}>
                        <p className={styles['location-name']}>
                            {clickedLocation.display_name.split(',')[0].trim()}
                        </p>
                        <p className={styles['location-address']}>
                            {clickedLocation.display_name}
                        </p>
                        <button
                            onClick={addClickedLocationToWaypoint}
                            className={styles['add-location-btn']}
                        >
                            Adicionar à Rota
                        </button>
                    </div>
                </div>
            )}

            <MapContainer center={center} zoom={15} className={styles['map-container']}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <MapClickHandler onMapClick={handleMapClick} />

                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={[Number(location.latitude), Number(location.longitude)]}
                    >
                        <Popup>
                            <div className={styles['popup-content']}>
                                <h3>{location.name}</h3>
                                <p>{location.description}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

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
                        positions={routeData.geometry.map((coord: [number, number]) =>
                            [coord[1], coord[0]])}
                            color="blue"
                            weight={4}
                    />
                )}

                {loadingAddress && (
                    <div className={styles['loading-overlay']}>
                        <div className={styles['loading-spinner']}></div>
                        <p>Buscando endereço...</p>
                    </div>
                )}
            </MapContainer>
        </div>
    )
}