import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useSmartRedirect } from "@/hooks/useSmartRedirect";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const { user, loading, error, login, isAuthenticated } = useFirebaseAuth();
  const { toast } = useToast();
  const { isRedirecting, targetPath } = useSmartRedirect();
  const [customerForm, setCustomerForm] = useState({ username: "", password: "" });

  const customerLoginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no login');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Login realizado com sucesso!",
        description: "Redirecionando para seu painel...",
      });
      // The smart redirect will handle the routing
      window.location.reload(); // Refresh to update auth state
    },
    onError: (error: any) => {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    console.log('Login page - Auth state:', { isAuthenticated, user: user ? { email: user.email, displayName: user.displayName } : null });
    
    if (isAuthenticated && user) {
      console.log('User authenticated, showing success toast and redirecting to:', targetPath);
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.displayName || user.email}!`,
      });
    }
  }, [isAuthenticated, user, toast, targetPath]);

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

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerForm.username && customerForm.password) {
      customerLoginMutation.mutate(customerForm);
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
    const getRedirectMessage = () => {
      if (targetPath === '/admin') {
        return 'Redirecionando para o painel administrativo...';
      } else if (targetPath === '/dashboard') {
        return 'Redirecionando para seu painel pessoal...';
      }
      return 'Redirecionando...';
    };

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
                <p className="text-muted-foreground">{getRedirectMessage()}</p>
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
            Acesse sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Google Login for Admins */}
          <div className="space-y-2">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-2 border-cuca-red/20 hover:border-cuca-red hover:bg-cuca-red/5"
              disabled={loading}
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cuca-red"></div>
                  Entrando com Google...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continuar com Google</span>
                  <span className="text-xs bg-cuca-red/10 text-cuca-red px-2 py-1 rounded">Admin</span>
                </div>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Para administradores - acesso ao painel administrativo
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Traditional Login for Customers */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-medium">Login de Cliente</h3>
              <p className="text-sm text-muted-foreground">Use suas credenciais de conta</p>
            </div>
            
            <form onSubmit={handleCustomerLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Seu nome de usuário"
                    value={customerForm.username}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={customerForm.password}
                    onChange={(e) => setCustomerForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-cuca-red hover:bg-cuca-red/90 text-white"
                disabled={customerLoginMutation.isPending}
                size="lg"
              >
                {customerLoginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Entrando...
                  </div>
                ) : (
                  "Entrar como Cliente"
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Não tem uma conta de cliente?{" "}
                <Link href="/register" className="text-cuca-red hover:underline font-medium">
                  Registre-se aqui
                </Link>
              </p>
            </div>
          </div>
          
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
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