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
    console.log('Firebase auth hook mounted');
    
    // Handle redirect result when component mounts
    handleRedirectResult()
      .then((result) => {
        if (result?.user) {
          console.log('User signed in via redirect:', result.user);
          console.log('User email:', result.user.email);
          console.log('User displayName:', result.user.displayName);
        } else {
          console.log('No redirect result found');
        }
      })
      .catch((error) => {
        console.error('Error handling redirect:', error);
        setAuthState(prev => ({ ...prev, error: error.message }));
      });

    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      if (user) {
        console.log('Current user:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
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
      console.log('Starting login process...');
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      console.log('Calling signInWithGoogle...');
      await signInWithGoogle();
      console.log('signInWithGoogle completed (redirect should happen)');
    } catch (error: any) {
      console.error('Login error:', error);
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