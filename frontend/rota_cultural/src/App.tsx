import 'leaflet/dist/leaflet.css';
import MapComponent from '@/components/MapComponent';

export default function App() {

  return (
    <>
    <div className="container w-full bg-black text-white p-4 min-h-screen">
      <MapComponent></MapComponent>
    </div>
    </>
  )
}

