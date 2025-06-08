#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function netlifyStaticBuild() {
  try {
    console.log('Building CUCA app for static Netlify deployment...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create backup of original files
    const backupDir = path.join(__dirname, 'netlify-backup');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Backup original files
    fs.copyFileSync(
      path.join(clientDir, 'src/hooks/useAuth.ts'),
      path.join(backupDir, 'useAuth.ts.backup')
    );
    fs.copyFileSync(
      path.join(clientDir, 'src/lib/queryClient.ts'),
      path.join(backupDir, 'queryClient.ts.backup')
    );
    
    // Create static-friendly version of useAuth
    const staticUseAuth = `import { useFirebaseAuth } from './useFirebaseAuth';
import { useState, useEffect } from 'react';

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
  const [customerSession, setCustomerSession] = useState<CustomerSession>({ authenticated: false });
  const [customerLoading, setCustomerLoading] = useState(false);
  const [backendUser, setBackendUser] = useState(null);
  const [backendLoading, setBackendLoading] = useState(false);
  
  // For static deployment, don't try to fetch from backend
  useEffect(() => {
    // Set default state for static deployment
    setCustomerSession({ authenticated: false, user: null });
    setCustomerLoading(false);
    setBackendUser(null);
    setBackendLoading(false);
  }, []);

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

    // Create static-friendly query client
    const staticQueryClient = `import { QueryClient, QueryFunction } from "@tanstack/react-query";

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
  // For static deployment, return mock responses for auth endpoints
  if (url.includes('/api/auth/')) {
    return new Response(JSON.stringify({ authenticated: false, user: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // For other API calls, try the request but handle failures gracefully
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
    console.warn('API request failed in static mode:', url, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // For auth endpoints in static deployment, return default values
    if (url.includes('/api/auth/session')) {
      return { authenticated: false, user: null };
    }
    
    if (url.includes('/api/auth/user')) {
      return null;
    }
    
    // For other endpoints, try the request but handle failures
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
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

    // Write the static versions
    fs.writeFileSync(path.join(clientDir, 'src/hooks/useAuth.ts'), staticUseAuth);
    fs.writeFileSync(path.join(clientDir, 'src/lib/queryClient.ts'), staticQueryClient);
    
    // Build the project
    console.log('Building client...');
    execSync(`cd ${clientDir} && npm run build`, { stdio: 'inherit' });
    
    // Restore original files
    fs.copyFileSync(
      path.join(backupDir, 'useAuth.ts.backup'),
      path.join(clientDir, 'src/hooks/useAuth.ts')
    );
    fs.copyFileSync(
      path.join(backupDir, 'queryClient.ts.backup'),
      path.join(clientDir, 'src/lib/queryClient.ts')
    );
    
    // Clean up backup directory
    fs.rmSync(backupDir, { recursive: true, force: true });
    
    // Verify build output
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ Build successful - index.html created');
      console.log('✓ Static files generated in dist/public');
      
      // List contents
      const files = fs.readdirSync(distDir);
      console.log('Build contents:', files);
    } else {
      throw new Error('Build failed - index.html not found');
    }
    
    console.log('🎉 Static build completed successfully!');
    console.log('📁 Files ready for Netlify deployment in: dist/public');
    
  } catch (error) {
    console.error('Build failed:', error);
    
    // Restore original files if they exist
    const backupDir = path.join(__dirname, 'netlify-backup');
    if (fs.existsSync(backupDir)) {
      const clientDir = path.resolve(__dirname, 'client');
      try {
        fs.copyFileSync(
          path.join(backupDir, 'useAuth.ts.backup'),
          path.join(clientDir, 'src/hooks/useAuth.ts')
        );
        fs.copyFileSync(
          path.join(backupDir, 'queryClient.ts.backup'),
          path.join(clientDir, 'src/lib/queryClient.ts')
        );
        fs.rmSync(backupDir, { recursive: true, force: true });
        console.log('Original files restored after build failure');
      } catch (restoreError) {
        console.warn('Could not restore original files:', restoreError);
      }
    }
    
    process.exit(1);
  }
}

netlifyStaticBuild();