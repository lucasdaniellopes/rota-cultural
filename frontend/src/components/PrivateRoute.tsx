import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#666',
        }}>
          Carregando...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />;
  }

  return <>{children}</>;
}
