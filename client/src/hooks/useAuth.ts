import { useFirebaseAuth } from './useFirebaseAuth';
import { useQuery } from "@tanstack/react-query";

interface CustomerSession {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export function useAuth() {
  const { user: firebaseUser, loading: firebaseLoading, isAuthenticated: firebaseAuthenticated } = useFirebaseAuth();
  
  // Check for customer session when Firebase auth is not active
  const { data: customerSession, isLoading: customerLoading } = useQuery<CustomerSession>({
    queryKey: ["/api/auth/session"],
    enabled: !firebaseAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Buscar dados do usuário do backend quando autenticado via Firebase
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: firebaseAuthenticated,
    retry: false,
  });

  // Determine final authentication state
  const isAuthenticated = firebaseAuthenticated || (customerSession?.authenticated ?? false);
  const finalUser = backendUser || 
    customerSession?.user || 
    (firebaseUser ? {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: 'admin'
    } : null);

  return {
    user: finalUser,
    isLoading: firebaseLoading || backendLoading || customerLoading,
    isAuthenticated,
  };
}