import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import { 
  User, 
  ShoppingCart, 
  MapPin, 
  Heart,
  Package,
  Settings,
  LogOut
} from "lucide-react";

export default function Dashboard() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa fazer login para acessar sua conta.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user orders
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["/api/user/orders"],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuca-yellow mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando sua conta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Minha Conta CUCA</h1>
              <p className="text-muted-foreground">Bem-vindo de volta, {user?.firstName}!</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = "/"}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                Ir para o Site
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Meus Pedidos</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{orders.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Total de pedidos realizados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos Favoritos</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Produtos na lista de desejos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos de Fidelidade</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Pontos acumulados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Gerencie suas informações de conta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Nome Completo</label>
                    <p className="text-lg">{user?.firstName} {user?.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Usuário</label>
                    <p className="text-lg">{user?.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Membro desde</label>
                    <p className="text-lg">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-AO') : 'N/A'}
                    </p>
                  </div>
                </div>
                <Button className="mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Pedidos</CardTitle>
                <CardDescription>
                  Acompanhe seus pedidos e compras anteriores
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">Pedido #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('pt-AO')}
                            </p>
                          </div>
                          <Badge variant={order.status === 'pending' ? 'destructive' : 'secondary'}>
                            {order.status === 'pending' ? 'Pendente' : 
                             order.status === 'processing' ? 'Processando' :
                             order.status === 'shipped' ? 'Enviado' : 'Entregue'}
                          </Badge>
                        </div>
                        <p className="font-medium">Total: {new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(parseFloat(order.total))}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                    <Button onClick={() => window.location.href = "/"}>
                      Explorar Produtos
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle>Produtos Favoritos</CardTitle>
                <CardDescription>
                  Seus produtos CUCA preferidos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Nenhum produto favoritado ainda</p>
                  <Button onClick={() => window.location.href = "/"}>
                    Descobrir Produtos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Conta</CardTitle>
                <CardDescription>
                  Personalize sua experiência CUCA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Notificações por Email</h4>
                      <p className="text-sm text-muted-foreground">Receber ofertas e novidades</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Ativar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Alterar Senha</h4>
                      <p className="text-sm text-muted-foreground">Atualizar sua senha de acesso</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Alterar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Excluir Conta</h4>
                      <p className="text-sm text-muted-foreground">Remover permanentemente sua conta</p>
                    </div>
                    <Button variant="destructive" size="sm">
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}