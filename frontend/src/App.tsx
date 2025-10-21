import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from '@/pages/HomePage';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import TouristPlacesPage from '@/pages/TouristPlacesPage';
import EventsPage from '@/pages/EventsPage';
import ItinerariesPage from '@/pages/ItinerariesPage';
 
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/pontos-turisticos" element={<TouristPlacesPage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/roteiros" element={<ItinerariesPage />} />
      </Routes>
    </BrowserRouter>
  )
}

