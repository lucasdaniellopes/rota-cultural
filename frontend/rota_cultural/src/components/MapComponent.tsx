import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {locationService, type Location} from '@/services/api'
import {routingService, type RouteData} from '@/services/routing'
import { Select,SelectContent, SelectItem,SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from './ui/button';
import { Card } from './ui/card';

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
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <p>Carregando mapa...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-black text-white">
                <p>{error}</p>
            </div>
        )
    }
    console.log(locations)
    return (
        <div className="relative w-full h-screen">

            <Card className="absolute -translate-y-1/2 left-4 top-1/2 right-4 z-[1001] bg-white p-5 shadow-lg w-80 h-auto">

                {waypoints.map((waypoint, index) => (
                    <div key={index} className="mb-2">
                        <Select value={waypoint?.id?.toString() || ''} onValueChange={(value) => {
                            handlewaypointChange(index, value)}}>
                            <SelectTrigger className='w-full'>
                                <SelectValue placeholder={index === 0 ? 'Partida' : index === waypoints.length - 1 ? 'Destino final' : `Parada ${index}`} />
                            </SelectTrigger>
                            <SelectContent className='z-[1001]'>
                                {locations.map((location) => (
                                    <SelectItem key={`${index}-${location.id}`} value={location.id.toString()}>
                                        {location.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {waypoints.length > 2 && (
                            <Button onClick={() => removeWaypoint(index)} size="sm">Remover</Button>
                        )}
                    </div>
                ))}
                <Button onClick={addWaypoint} size="sm" className="mb-2">Adicionar Parada</Button>


           

                {waypoints.length >= 2 && waypoints.every(waypoint => waypoint) &&  (
                    <Button onClick={calculateRoute}>
                        {loadingRoute ? 'Calculando...' : 'Calcular Rota'}
                    </Button>
                )}

            </Card>
          
            


            <MapContainer center={center} zoom={15} className='w-full h-full'>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {locations.map((location) => (
                    <Marker
                    key={location.id}
                    position={[Number(location.latitude), Number(location.longitude)]}
                    >
                        <Popup>{location.name}</Popup>
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