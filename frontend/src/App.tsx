import 'leaflet/dist/leaflet.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/PrivateRoute';
import MapPage from '@/pages/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ListingPage from '@/pages/ListingPage';
import ItemDetailPage from '@/pages/ItemDetailPage';
import CreateItemPage from '@/pages/CreateItemPage';
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
          <Route path="/pontos-turisticos" element={<ListingPage type="places" />} />
          <Route path="/pontos-turisticos/criar" element={<PrivateRoute><CreateItemPage type="place" /></PrivateRoute>} />
          <Route path="/pontos-turisticos/:id/editar" element={<PrivateRoute><CreateItemPage type="place" /></PrivateRoute>} />
          <Route path="/pontos-turisticos/:id" element={<ItemDetailPage type="place" />} />
          <Route path="/eventos" element={<ListingPage type="events" />} />
          <Route path="/eventos/criar" element={<PrivateRoute><CreateItemPage type="event" /></PrivateRoute>} />
          <Route path="/eventos/:id/editar" element={<PrivateRoute><CreateItemPage type="event" /></PrivateRoute>} />
          <Route path="/eventos/:id" element={<ItemDetailPage type="event" />} />
          <Route path="/favoritos" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/avaliacoes" element={<PrivateRoute><ReviewsPage /></PrivateRoute>} />
          <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
