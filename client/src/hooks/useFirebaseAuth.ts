import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth, onAuthStateChange, signInWithGoogle, signOutUser, handleRedirectResult } from '@/lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useFirebaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Handle redirect result when component mounts
    handleRedirectResult()
      .then((result) => {
        if (result?.user) {
          // User signed in successfully
          console.log('User signed in:', result.user);
        }
      })
      .catch((error) => {
        console.error('Error handling redirect:', error);
        setAuthState(prev => ({ ...prev, error: error.message }));
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signInWithGoogle();
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const logout = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      await signOutUser();
    } catch (error: any) {
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    isAuthenticated: !!authState.user,
  };
}