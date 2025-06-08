import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import { User, Mail, Lock, Phone, ArrowLeft } from "lucide-react";

const registerSchema = z.object({
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
  firstName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  lastName: z.string().min(2, "Sobrenome deve ter pelo menos 2 caracteres"),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      phone: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const { confirmPassword, ...registerData } = data;
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro no registro');
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Conta criada com sucesso!",
        description: "Você já pode fazer login com suas credenciais.",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "Erro no registro",
        description: error.message || "Ocorreu um erro ao criar sua conta.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cuca-red/10 to-cuca-yellow/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cuca-red mb-4 self-start">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao login
          </Link>
          <div className="mx-auto mb-4 w-20 h-20 bg-cuca-red rounded-full flex items-center justify-center">
            <User className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Criar Conta Cliente
          </CardTitle>
          <CardDescription>
            Registre-se para acessar seu painel pessoal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input placeholder="João" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sobrenome</FormLabel>
                      <FormControl>
                        <Input placeholder="Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de usuário</FormLabel>
                    <FormControl>
                      <Input placeholder="joaosilva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="joao@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="+244 900 000 000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-cuca-red hover:bg-cuca-red/90 text-white"
                disabled={registerMutation.isPending}
                size="lg"
              >
                {registerMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Criando conta...
                  </div>
                ) : (
                  "Criar conta"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Já tem uma conta?{" "}
              <Link href="/login" className="text-cuca-red hover:underline">
                Fazer login
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>
              Ao criar uma conta, você concorda com nossos{" "}
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