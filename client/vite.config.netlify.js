import { defineConfig } from "vite";
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
          'router-vendor': ['wouter'],
          'query-vendor': ['@tanstack/react-query'],
          'radix-vendor': ['@radix-ui/react-slot', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
          'motion-vendor': ['framer-motion']
        }
      },
      external: (id) => {
        // Reduce lucide-react bundle size by excluding unused icons
        if (id.includes('lucide-react/dist/esm/icons/') && 
            !['menu', 'x', 'star', 'heart', 'phone', 'mail', 'map-pin', 'loader-2', 'check', 'chevron-down', 'chevron-up', 'arrow-right'].some(icon => id.includes(icon))) {
          return false;
        }
        return false;
      }
    }
  },
  define: {
    global: 'globalThis',
    'process.env.NODE_ENV': '"production"'
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'wouter', '@tanstack/react-query']
  }
});