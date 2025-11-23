import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import { api } from '../services/api';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_tourist: boolean;
  date_joined: string;
  phone?: string;
  birth_date?: string;
  bio?: string;
  avatar?: string;
}

export interface SignupData {
  email: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar se há tokens salvos ao montar o componente
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          const response = await api.get('/users/me/');
          setUser(response.data);
        } catch (err: any) {
          // Token inválido ou expirado
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        }
      }
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login/', {
        email: data.email,
        password: data.password,
      });

      const { access, refresh } = response.data;

      // Armazenar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Buscar dados do usuário
      const userResponse = await api.get('/users/me/');
      setUser(userResponse.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        'Falha ao fazer login';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Registrar novo usuário
      const registerResponse = await api.post('/auth/register/', {
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      });

      // Extrair tokens da resposta do registro
      const { access, refresh, user: userData } = registerResponse.data;

      // Armazenar tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Definir usuário no state com os dados retornados
      setUser(userData);
    } catch (err: any) {
      const errorData = err.response?.data;
      let errorMessage = 'Falha ao registrar';

      if (typeof errorData === 'object') {
        // Tentar extrair mensagem de erro mais específica
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors?.[0]) {
          errorMessage = errorData.non_field_errors[0];
        } else if (errorData.email?.[0]) {
          errorMessage = `Email: ${errorData.email[0]}`;
        } else if (errorData.password?.[0]) {
          errorMessage = `Senha: ${errorData.password[0]}`;
        }
      }

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // Notificar backend sobre logout (opcional)
      try {
        await api.post('/auth/logout/', {});
      } catch {
        // Continuar mesmo se falhar
      }

      // Limpar tokens e usuário
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/users/me/');
      setUser(response.data);
    } catch (err) {
      // Token inválido
      logout();
    }
  }, [logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    error,
    login,
    signup,
    logout,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
