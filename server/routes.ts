import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactMessageSchema,
  insertProductSchema,
  insertOrderSchema,
  insertAnalyticsEventSchema,
  insertFanPhotoSchema,
  insertUserSchema 
} from "@shared/schema";
import { getCurrentUser } from "./firebaseAuth";
import { seedDatabase } from "./seed";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed database on startup
  await seedDatabase();

  // Firebase Auth routes
  app.get('/api/auth/user', getCurrentUser);
  
  // Customer authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getCustomerByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Nome de usuário já existe' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create customer
      const customer = await storage.createCustomer({
        ...validatedData,
        password: hashedPassword,
      });
      
      // Don't return password
      const { password, ...customerData } = customer;
      res.json({ success: true, user: customerData });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
      } else {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
      }
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Nome de usuário e senha são obrigatórios' });
      }
      
      // Find user by username
      const user = await storage.getCustomerByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Determine user role - check if this is an admin account
      let userRole = 'customer';
      
      // Check for admin credentials (you can modify these conditions)
      if (username.toLowerCase().includes('admin') || 
          user.email?.toLowerCase().includes('admin') ||
          username === 'admin' || // Default admin username
          user.firstName?.toLowerCase() === 'admin') {
        userRole = 'admin';
      }
      
      // Set session
      req.session = req.session || {};
      (req.session as any).userId = user.id;
      (req.session as any).userType = userRole === 'admin' ? 'admin' : 'customer';
      
      // Don't return password
      const { password: _, ...userData } = user;
      res.json({ success: true, user: { ...userData, role: userRole } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.get('/api/auth/session', async (req, res) => {
    try {
      if (!req.session || !(req.session as any).userId) {
        return res.json({ authenticated: false, user: null });
      }

      const userId = (req.session as any).userId;
      const user = await storage.getCustomer(userId);
      
      if (!user) {
        return res.json({ authenticated: false, user: null });
      }

      // Determine user role using the same logic as login
      let userRole = 'customer';
      if (user.username?.toLowerCase().includes('admin') || 
          user.email?.toLowerCase().includes('admin') ||
          user.username === 'admin' ||
          user.firstName?.toLowerCase() === 'admin') {
        userRole = 'admin';
      }

      // Don't return password
      const { password, ...userData } = user;
      res.json({ authenticated: true, user: { ...userData, role: userRole } });
    } catch (error) {
      console.error('Session check error:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
          return res.status(500).json({ message: 'Erro ao fazer logout' });
        }
        res.json({ success: true, message: 'Logout realizado com sucesso' });
      });
    } else {
      res.json({ success: true, message: 'Logout realizado com sucesso' });
    }
  });
  
  // Simple auth check endpoint (without requiring token validation)
  app.get('/api/auth/check', (req, res) => {
    // For development, we'll trust the frontend auth state
    res.json({ authenticated: true, user: { role: 'admin' } });
  });

  // Contact form submission endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json({ success: true, message: "Mensagem enviada com sucesso!" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  // Admin routes (temporarily unprotected for debugging)
  app.get("/api/admin/contact-messages", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch("/api/admin/contact-messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const message = await storage.updateContactMessage(id, updates);
      res.json(message);
    } catch (error) {
      console.error("Error updating contact message:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Product management routes
  app.get("/api/admin/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      const activeProducts = products.filter(p => p.isActive);
      res.json(activeProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const result = insertProductSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }

      const product = await storage.createProduct(result.data);
      res.json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch("/api/admin/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Customer management routes
  app.get("/api/admin/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.patch("/api/admin/customers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const customer = await storage.updateCustomer(id, updates);
      res.json(customer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ message: "Failed to update customer" });
    }
  });

  // Order management routes
  app.get("/api/admin/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.patch("/api/admin/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      res.json(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Analytics routes
  app.post("/api/analytics", async (req, res) => {
    try {
      const result = insertAnalyticsEventSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid input",
          errors: result.error.issues,
        });
      }

      const event = await storage.createAnalyticsEvent(result.data);
      res.json(event);
    } catch (error) {
      console.error("Error creating analytics event:", error);
      res.status(500).json({ message: "Failed to create analytics event" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const events = await storage.getAnalyticsEvents(limit);
      res.json(events);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const [products, customers, orders, messages] = await Promise.all([
        storage.getProducts(),
        storage.getCustomers(),
        storage.getOrders(),
        storage.getContactMessages()
      ]);

      const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.isActive).length,
        totalCustomers: customers.length,
        activeCustomers: customers.filter(c => c.isActive).length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        unreadMessages: messages.filter(m => m.status === 'unread').length,
        totalRevenue: orders
          .filter(o => o.paymentStatus === 'paid')
          .reduce((sum, o) => sum + parseFloat(o.total), 0)
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Fan Gallery routes
  app.post("/api/fan-gallery", async (req, res) => {
    try {
      const result = insertFanPhotoSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Dados inválidos",
          errors: result.error.issues,
        });
      }

      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const photoData = { ...result.data, userId };
      const photo = await storage.createFanPhoto(photoData);
      res.json({ success: true, message: "Foto enviada com sucesso! Aguardando aprovação.", photo });
    } catch (error) {
      console.error("Error creating fan photo:", error);
      res.status(500).json({ message: "Erro ao enviar foto" });
    }
  });

  app.get("/api/fan-gallery", async (req, res) => {
    try {
      const photos = await storage.getApprovedFanPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching approved photos:", error);
      res.status(500).json({ message: "Erro ao buscar fotos" });
    }
  });

  // Admin fan gallery routes
  app.get("/api/admin/fan-gallery", async (req, res) => {
    try {
      const photos = await storage.getFanPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching all photos:", error);
      res.status(500).json({ message: "Erro ao buscar fotos" });
    }
  });

  app.get("/api/admin/fan-gallery/pending", async (req, res) => {
    try {
      const photos = await storage.getPendingFanPhotos();
      res.json(photos);
    } catch (error) {
      console.error("Error fetching pending photos:", error);
      res.status(500).json({ message: "Erro ao buscar fotos pendentes" });
    }
  });

  app.patch("/api/admin/fan-gallery/:id/approve", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adminUser = (req.session as any).user?.username || "admin";
      
      const photo = await storage.updateFanPhotoStatus(id, "approved", adminUser);
      res.json({ success: true, message: "Foto aprovada com sucesso!", photo });
    } catch (error) {
      console.error("Error approving photo:", error);
      res.status(500).json({ message: "Erro ao aprovar foto" });
    }
  });

  app.patch("/api/admin/fan-gallery/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const adminUser = (req.session as any).user?.username || "admin";
      
      const photo = await storage.updateFanPhotoStatus(id, "rejected", adminUser);
      res.json({ success: true, message: "Foto rejeitada com sucesso!", photo });
    } catch (error) {
      console.error("Error rejecting photo:", error);
      res.status(500).json({ message: "Erro ao rejeitar foto" });
    }
  });

  app.delete("/api/admin/fan-gallery/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFanPhoto(id);
      res.json({ success: true, message: "Foto removida com sucesso!" });
    } catch (error) {
      console.error("Error deleting photo:", error);
      res.status(500).json({ message: "Erro ao remover foto" });
    }
  });

  // User photo routes (authenticated)
  app.get("/api/user/my-photos", async (req, res) => {
    try {
      const userId = (req.session as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const photos = await storage.getUserPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching user photos:", error);
      res.status(500).json({ message: "Erro ao buscar suas fotos" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
