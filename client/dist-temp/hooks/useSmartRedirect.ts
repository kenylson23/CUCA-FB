import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from './useAuth';

interface RedirectConfig {
  admin: string;
  customer: string;
  default: string;
}

interface UserWithRole {
  id?: string | number;
  email?: string | null;
  displayName?: string | null;
  role?: string;
  username?: string;
}

const DEFAULT_REDIRECTS: RedirectConfig = {
  admin: '/admin',
  customer: '/dashboard', 
  default: '/admin'
};

export function useSmartRedirect(redirects: Partial<RedirectConfig> = {}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const finalRedirects = { ...DEFAULT_REDIRECTS, ...redirects };

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    // Determine redirect based on user role from database
    let redirectPath = finalRedirects.default;
    
    if (user && typeof user === 'object') {
      const typedUser = user as UserWithRole;
      
      // Check role from database - both Firebase and traditional users can be admin
      if (typedUser.role === 'admin') {
        redirectPath = finalRedirects.admin;
      } else {
        // Default to dashboard for all other users
        redirectPath = finalRedirects.customer;
      }
    }

    // Perform redirect with slight delay for UX
    const timeoutId = setTimeout(() => {
      setLocation(redirectPath);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isAuthenticated, user, isLoading, setLocation, finalRedirects]);

  // Safe type checking for return value
  const getTargetPath = () => {
    if (!user || typeof user !== 'object') return finalRedirects.default;
    
    const typedUser = user as UserWithRole;
    if (typedUser.role === 'admin') return finalRedirects.admin;
    if (typedUser.username) return finalRedirects.customer;
    return finalRedirects.default;
  };
  
  return {
    isRedirecting: isAuthenticated && !isLoading,
    targetPath: getTargetPath()
  };
}

export function getRedirectPath(user: UserWithRole | null): string {
  if (!user) return '/login';
  
  if (user.role === 'admin') {
    return '/admin';
  } else if (user.role === 'customer' || user.username) {
    return '/dashboard';
  }
  
  return '/admin'; // Default fallback
}