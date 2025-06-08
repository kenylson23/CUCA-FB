#!/usr/bin/env node

import { build } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildStatic() {
  try {
    console.log('Building static frontend...');
    
    await build({
      plugins: [react()],
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "client", "src"),
          "@shared": path.resolve(__dirname, "shared"),
          "@assets": path.resolve(__dirname, "attached_assets"),
        },
      },
      root: path.resolve(__dirname, "client"),
      build: {
        outDir: path.resolve(__dirname, "dist/public"),
        emptyOutDir: true,
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'motion': ['framer-motion'],
              'radix': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
              'icons': ['lucide-react']
            }
          }
        }
      },
      esbuild: {
        drop: ['console', 'debugger'],
      },
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    });
    
    console.log('✓ Static build completed');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildStatic();