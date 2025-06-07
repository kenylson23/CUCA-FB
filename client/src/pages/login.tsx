import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useLocation } from "wouter";

export default function LoginPage() {
  const { user, loading, error, login, isAuthenticated } = useFirebaseAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    console.log('Login page - Auth state:', { isAuthenticated, user: user ? { email: user.email, displayName: user.displayName } : null });
    
    if (isAuthenticated && user) {
      console.log('User authenticated, showing success toast and redirecting');
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.displayName || user.email}!`,
      });
      
      // Redirecionar para admin se o usuário for autenticado
      setTimeout(() => {
        console.log('Redirecting to /admin');
        setLocation("/admin");
      }, 1000);
    }
  }, [isAuthenticated, user, toast, setLocation]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro no login",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleGoogleLogin = async () => {
    try {
      console.log('Login button clicked, starting Google sign in...');
      await login();
      console.log('Login function completed');
    } catch (err) {
      console.error("Erro no login:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cuca-red"></div>
              <span>Carregando...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Login realizado!</h3>
                <p className="text-muted-foreground">Redirecionando...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-20 h-20 bg-cuca-red rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Bem-vindo à CUCA
          </CardTitle>
          <CardDescription>
            Entre com sua conta Google para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="w-full bg-cuca-red hover:bg-cuca-red/90 text-white"
            disabled={loading}
            size="lg"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Entrando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </div>
            )}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Ao fazer login, você concorda com nossos{" "}
              <a href="#" className="text-cuca-red hover:underline">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="text-cuca-red hover:underline">
                Política de Privacidade
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}