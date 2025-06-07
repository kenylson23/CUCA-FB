import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
  redirectTo?: string;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  redirectTo = '/login' 
}: RouteGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isLoading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa fazer login para acessar esta página.",
        variant: "destructive",
      });
      setLocation(redirectTo);
      return;
    }

    // Check role permissions
    if (isAuthenticated && user && allowedRoles.length > 0) {
      const userRole = (user as any)?.role;
      if (!allowedRoles.includes(userRole)) {
        toast({
          title: "Acesso Restrito",
          description: "Você não tem permissão para acessar esta página.",
          variant: "destructive",
        });
        
        // Redirect based on user role
        if (userRole === 'admin') {
          setLocation('/admin');
        } else if (userRole === 'customer' || (user as any)?.username) {
          setLocation('/dashboard');
        } else {
          setLocation('/');
        }
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireAuth, allowedRoles, redirectTo, setLocation, toast]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-cuca-red" />
              <span>Verificando autenticação...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Don't render children if authentication checks fail
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (isAuthenticated && user && allowedRoles.length > 0) {
    const userRole = (user as any)?.role;
    if (!allowedRoles.includes(userRole)) {
      return null;
    }
  }

  return <>{children}</>;
}

// Convenience components for specific route types
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard allowedRoles={['admin']} redirectTo="/login">
      {children}
    </RouteGuard>
  );
}

export function CustomerRoute({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Allow access if user is authenticated and either has customer role or has username (traditional customer)
  const hasCustomerAccess = isAuthenticated && user && 
    ((user as any)?.role === 'customer' || (user as any)?.username);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-cuca-red" />
              <span>Verificando autenticação...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!hasCustomerAccess) {
    return (
      <RouteGuard requireAuth={true} redirectTo="/login">
        {children}
      </RouteGuard>
    );
  }
  
  return <>{children}</>;
}

export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth={false}>
      {children}
    </RouteGuard>
  );
}