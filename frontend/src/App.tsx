import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/PrivateRoute';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import TouristPlacesPage from '@/pages/TouristPlacesPage';
import TouristPlaceDetailPage from '@/pages/TouristPlaceDetailPage';
import EventsPage from '@/pages/EventsPage';
import EventDetailPage from '@/pages/EventDetailPage';
import CreateEventPage from '@/pages/CreateEventPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ReviewsPage from '@/pages/ReviewsPage';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/cadastro" element={<SignupPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/pontos-turisticos" element={<TouristPlacesPage />} />
          <Route path="/pontos-turisticos/:id" element={<TouristPlaceDetailPage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/criar" element={<PrivateRoute><CreateEventPage /></PrivateRoute>} />
          <Route path="/eventos/:id" element={<EventDetailPage />} />
          <Route path="/favoritos" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/avaliacoes" element={<PrivateRoute><ReviewsPage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
