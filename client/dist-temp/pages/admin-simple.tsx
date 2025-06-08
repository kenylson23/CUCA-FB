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
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Home
} from "lucide-react";

export default function AdminPanel() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Acesso Negado",
        description: "Você precisa fazer login para acessar o painel administrativo.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch admin stats
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    enabled: isAuthenticated,
  });

  // Fetch contact messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/admin/contact-messages"],
    enabled: isAuthenticated,
  });

  // Fetch customers
  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["/api/admin/customers"],
    enabled: isAuthenticated,
  });

  // Update message status mutation
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error('Failed to update message');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contact-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Sucesso",
        description: "Mensagem atualizada com sucesso.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sessão Expirada",
          description: "Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar mensagem.",
        variant: "destructive",
      });
    },
  });

  // Update customer status mutation
  const updateCustomerMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: any }) => {
      const response = await fetch(`/api/admin/customers/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error('Failed to update customer');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/customers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Sessão Expirada",
          description: "Fazendo login novamente...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      toast({
        title: "Erro",
        description: "Falha ao atualizar cliente.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cuca-yellow mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando autenticação...</p>
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
              <h1 className="text-2xl font-bold text-foreground">Painel Administrativo CUCA</h1>
              <p className="text-muted-foreground">Gerencie produtos, pedidos e clientes</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/admin/galeria"}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Galeria dos Fãs
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = "/"}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Ir para o Site
              </Button>
              <Button 
                variant="outline" 
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalProducts || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeCustomers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalCustomers || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.pendingOrders || 0} pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-AO', {
                    style: 'currency',
                    currency: 'AOA'
                  }).format(stats.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.unreadMessages || 0} mensagens não lidas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="messages">Mensagens</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensagens de Contato</CardTitle>
                <CardDescription>
                  Gerencie as mensagens recebidas dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {messagesLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : Array.isArray(messages) && messages.length > 0 ? (
                  <div className="space-y-4">
                    {messages.map((message: any) => (
                      <div key={message.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{message.name}</h4>
                            <p className="text-sm text-muted-foreground">{message.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={message.status === 'unread' ? 'destructive' : 'secondary'}>
                              {message.status === 'unread' ? 'Não lida' : 'Lida'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateMessageMutation.mutate({ 
                                id: message.id, 
                                updates: { status: message.status === 'unread' ? 'read' : 'unread' }
                              })}
                            >
                              {message.status === 'unread' ? <Eye className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        <h5 className="font-medium mb-2">{message.subject}</h5>
                        <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleString('pt-AO')}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhuma mensagem encontrada
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs with placeholder content */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Produtos</CardTitle>
                <CardDescription>
                  Gerencie o catálogo de produtos CUCA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade de gestão de produtos em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Pedidos</CardTitle>
                <CardDescription>
                  Acompanhe e gerencie os pedidos dos clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Funcionalidade de gestão de pedidos em desenvolvimento
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Clientes</CardTitle>
                <CardDescription>
                  Visualize e gerencie os clientes cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customersLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cuca-yellow"></div>
                  </div>
                ) : Array.isArray(customers) && customers.length > 0 ? (
                  <div className="space-y-4">
                    {customers.map((customer: any) => (
                      <div key={customer.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-lg">
                                {customer.firstName && customer.lastName 
                                  ? `${customer.firstName} ${customer.lastName}` 
                                  : customer.username}
                              </h4>
                              <Badge variant={customer.isActive ? 'default' : 'secondary'}>
                                {customer.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <div>
                                <p><span className="font-medium">Email:</span> {customer.email}</p>
                                <p><span className="font-medium">Username:</span> {customer.username}</p>
                              </div>
                              <div>
                                {customer.phone && (
                                  <p><span className="font-medium">Telefone:</span> {customer.phone}</p>
                                )}
                                <p><span className="font-medium">Cadastrado:</span> {new Date(customer.createdAt).toLocaleDateString('pt-AO')}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <select
                              value={customer.isActive ? 'active' : 'inactive'}
                              onChange={(e) => updateCustomerMutation.mutate({ 
                                id: customer.id, 
                                updates: { isActive: e.target.value === 'active' }
                              })}
                              className="text-sm border rounded px-3 py-1 bg-background"
                              disabled={updateCustomerMutation.isPending}
                            >
                              <option value="active">Ativo</option>
                              <option value="inactive">Inativo</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="text-xs text-muted-foreground">
                            ID: #{customer.id} • Última atualização: {new Date(customer.updatedAt).toLocaleDateString('pt-AO')}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {customer.isActive ? '🟢 Conta Ativa' : '🔴 Conta Inativa'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-muted-foreground">
                    Nenhum cliente encontrado
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}