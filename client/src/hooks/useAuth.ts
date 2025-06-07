import { useFirebaseAuth } from './useFirebaseAuth';
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { user: firebaseUser, loading: firebaseLoading, isAuthenticated } = useFirebaseAuth();
  
  // Buscar dados do usuário do backend quando autenticado
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: isAuthenticated,
    retry: false,
  });

  return {
    user: backendUser || (firebaseUser ? {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: 'admin'
    } : null),
    isLoading: firebaseLoading || backendLoading,
    isAuthenticated,
  };
}