import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      return { Authorization: `Bearer ${token}` };
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }
  }
  return {};
}

export async function apiRequest(
  url: string,
  method: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = await getAuthHeaders();
  
  const headers: Record<string, string> = {};
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  Object.assign(headers, authHeaders);

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    try {
      const authHeaders = await getAuthHeaders();
      
      const res = await fetch(url, {
        credentials: "include",
        headers: Object.keys(authHeaders).length > 0 ? authHeaders : undefined,
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // For static deployments, handle auth endpoints gracefully
      if (url.includes('/api/auth/session')) {
        return { authenticated: false, user: null };
      }
      
      if (url.includes('/api/auth/user')) {
        return null;
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
});
