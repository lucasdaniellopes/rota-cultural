import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import TouristPlacesPage from '@/pages/TouristPlacesPage';
import TouristPlaceDetailPage from '@/pages/TouristPlaceDetailPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ReviewsPage from '@/pages/ReviewsPage';
import HomePage from '@/pages/HomePage';
 
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignupPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
        <Route path="/pontos-turisticos" element={<TouristPlacesPage />} />
        <Route path="/pontos-turisticos/:id" element={<TouristPlaceDetailPage />} />
        <Route path="/eventos" element={<EventsPage />} />
        <Route path="/eventos/:id" element={<EventDetailPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/avaliacoes" element={<ReviewsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
