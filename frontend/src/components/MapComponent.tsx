import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import {locationService, type Location} from '@/services/api'
import {routingService, type RouteData} from '@/services/routing'
import DestinationSelector from './map/DestinationSelector'
import styles from '@/styles/MapComponent.module.css';

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

export default function MapComponent() {
    const [waypoints, setWaypoints] = useState<(Location | null)[]>([null, null])
    const [routeData, setRouteData] = useState<RouteData | null>(null)
    const [loadingRoute, setLoadingRoute] = useState(false)
    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
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

            <MapContainer center={center} zoom={15} className={styles['map-container']}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

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

                {routeData && (
                    <Polyline
                        positions={routeData.geometry.map((coord: [number, number]) =>
                            [coord[1], coord[0]])}
                            color="blue"
                            weight={4}
                    />
                )}

            </MapContainer>
        </div>
    )
}