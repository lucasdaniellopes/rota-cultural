import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import {locationService, type Location} from '@/services/api'

export default function MapComponent() {
    const [locations, setLocations] = useState<Location[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

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
        <MapContainer center={center} zoom={15} className='w-full h-96'>
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

        </MapContainer>
    )
}