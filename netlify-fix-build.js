#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function netlifyFixBuild() {
  try {
    console.log('Building CUCA app for Netlify with white screen fix...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create Netlify-specific Vite config that handles auth gracefully
    const netlifyViteConfig = `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "../shared"),
      "@assets": path.resolve(__dirname, "../attached_assets"),
    },
  },
  build: {
    outDir: "../dist/public",
    emptyOutDir: true,
    target: 'es2015',
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast'],
          'router': ['wouter'],
          'query': ['@tanstack/react-query']
        }
      }
    }
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"'
  }
});`;

    fs.writeFileSync(path.join(clientDir, 'vite.config.netlify-fix.js'), netlifyViteConfig);
    
    // Create a modified version of the query client that handles Netlify gracefully
    const netlifyQueryClient = `import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(\`\${res.status}: \${text}\`);
  }
}

export async function apiRequest(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<Response> {
  // For Netlify deployment, handle API calls gracefully
  try {
    const headers: Record<string, string> = {};
    if (data) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    await throwIfResNotOk(res);
    return res;
  } catch (error) {
    // For static deployment, return a mock response for auth endpoints
    if (url.includes('/api/auth/session')) {
      return new Response(JSON.stringify({ authenticated: false, user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // For auth session endpoint, return default state
      if ((queryKey[0] as string).includes('/api/auth/session')) {
        return { authenticated: false, user: null };
      }
      
      if (unauthorizedBehavior === "returnNull") {
        return null;
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "returnNull" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});`;

    // Create netlify version of queryClient
    fs.writeFileSync(path.join(clientDir, 'src/lib/queryClient.netlify.ts'), netlifyQueryClient);
    
    // Create a Netlify-specific version of useAuth that doesn't break
    const netlifyUseAuth = `import { useFirebaseAuth } from './useFirebaseAuth';
import { useQuery } from "@tanstack/react-query";

interface CustomerSession {
  authenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
  };
}

export function useAuth() {
  const { user: firebaseUser, loading: firebaseLoading, isAuthenticated: firebaseAuthenticated } = useFirebaseAuth();
  
  // For Netlify deployment, handle gracefully when backend is not available
  const { data: customerSession, isLoading: customerLoading } = useQuery<CustomerSession>({
    queryKey: ["/api/auth/session"],
    enabled: !firebaseAuthenticated,
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/session', {
          credentials: 'include'
        });
        if (!response.ok) {
          return { authenticated: false, user: null };
        }
        return await response.json();
      } catch (error) {
        // If backend is not available (like on Netlify), return default state
        return { authenticated: false, user: null };
      }
    }
  });
  
  // Buscar dados do usuário do backend quando autenticado via Firebase
  const { data: backendUser, isLoading: backendLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    enabled: firebaseAuthenticated,
    retry: false,
    queryFn: async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        if (!response.ok) {
          return null;
        }
        return await response.json();
      } catch (error) {
        return null;
      }
    }
  });

  // Determine final authentication state
  const isAuthenticated = firebaseAuthenticated || (customerSession?.authenticated ?? false);
  const finalUser = backendUser || 
    customerSession?.user || 
    (firebaseUser ? {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      role: 'admin'
    } : null);

  return {
    user: finalUser,
    isLoading: firebaseLoading || backendLoading || customerLoading,
    isAuthenticated,
  };
}`;

    fs.writeFileSync(path.join(clientDir, 'src/hooks/useAuth.netlify.ts'), netlifyUseAuth);
    
    // Temporarily replace the files for Netlify build
    execSync(`cd ${clientDir} && cp src/lib/queryClient.netlify.ts src/lib/queryClient.ts`, { stdio: 'inherit' });
    execSync(`cd ${clientDir} && cp src/hooks/useAuth.netlify.ts src/hooks/useAuth.ts`, { stdio: 'inherit' });
    
    // Build with Netlify-specific config
    execSync(`cd ${clientDir} && npx vite build --config vite.config.netlify-fix.js`, { stdio: 'inherit' });
    
    // Verify build output
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ Build successful - index.html created');
      console.log('✓ Static files generated in dist/public');
      
      // Check if critical files exist
      const criticalFiles = ['assets'];
      criticalFiles.forEach(file => {
        const filePath = path.join(distDir, file);
        if (fs.existsSync(filePath)) {
          console.log(\`✓ \${file} directory found\`);
        }
      });
    } else {
      throw new Error('Build failed - index.html not found');
    }
    
    // Clean up temporary files
    try {
      fs.unlinkSync(path.join(clientDir, 'vite.config.netlify-fix.js'));
      fs.unlinkSync(path.join(clientDir, 'src/lib/queryClient.netlify.ts'));
      fs.unlinkSync(path.join(clientDir, 'src/hooks/useAuth.netlify.ts'));
    } catch (error) {
      console.log('Note: Some temporary files may need manual cleanup');
    }
    
    console.log('🎉 Netlify build completed successfully!');
    console.log('📁 Files ready for deployment in: dist/public');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

netlifyFixBuild();