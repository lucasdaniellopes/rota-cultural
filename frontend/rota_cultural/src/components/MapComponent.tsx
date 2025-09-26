import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {locationService, type Location} from '@/services/api'
import {routingService, type RouteData} from '@/services/routing'

export default function MapComponent() {
    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedStart, setSelectedStart] = useState<Location | null>(null)
    const [selectedEnd, setSelectedEnd] = useState<Location | null>(null)
    const [routeData, setRouteData] = useState<RouteData | null>(null)
    const [loadingRoute, setLoadingRoute] = useState<boolean>(false)


    const calculateRoute = async () => {
        if (!selectedStart || !selectedEnd) return
        
        setLoadingRoute(true)
        try {
            const route = await routingService.calculateRoute(selectedStart.id, selectedEnd.id)
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


    const center: [number,number] = [-7.026368, -37.277010] //centro de patos

    return (
        <div>
            <div className="p-4 bg-black text-white">
                <div className="flex gap-4 items-center mb-4">
                    <select
                        value={selectedStart?.id || ''}
                        onChange={(e) => setSelectedStart(locations.find(location => location.id === Number(e.target.value)) || null)}
                        className="p-2 bg-gray-800 text-white rounded"
                    >
                        <option value="" disabled>Selecione o ponto de partida</option>
                        {locations.map(location => (
                            <option key={`start-${location.id}`} value={location.id}>{location.name}</option>
                        ))}
                    </select>

                    <select
                        value={selectedEnd?.id || ''}
                        onChange={(e) => setSelectedEnd(locations.find(location => location.id === Number(e.target.value)) || null)}
                        className="p-2 bg-gray-800 text-white rounded"
                    >
                        <option value="" disabled>Selecione o ponto de destino</option>
                        {locations.map(location => (
                            <option key={`end-${location.id}`} value={location.id}>{location.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={calculateRoute}
                        disabled={!selectedStart || !selectedEnd || loadingRoute}
                        className="p-2 bg-blue-600 text-white rounded disabled:bg-gray-600 cursor-pointer"
                        >
                          {loadingRoute ? 'Calculando...' : 'Calcular Rota'}
                        </button>
                </div>
            </div>

            <MapContainer center={center} zoom={15} className='w-full h-[80vh]'>
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