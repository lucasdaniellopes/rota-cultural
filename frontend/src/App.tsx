import 'leaflet/dist/leaflet.css';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import MapPage from '@/pages/MapPage/MapPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
 
export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/map" element={<MapPage />} />
         <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

