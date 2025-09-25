import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import 'leaflet/dist/leaflet.css';

export default function MapComponent() {
    const center: [number,number] = [-7.026368, -37.277010] //centro de patos

    const point1: [number, number] = [-7.026368, -37.277010]
    const point2: [number, number] = [-7.010666, -37.294711]

    return (
        <MapContainer center={center} zoom={15} className='w-full h-96'>
            <TileLayer 
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <Marker position={point1}> 
                <Popup>Ponto 1 - Centro de Patos</Popup>    
            </Marker>

            <Marker position={point2}>
                <Popup>Ponto 2 - Local próximo</Popup>   
            </Marker>       

        </MapContainer>
    )
}