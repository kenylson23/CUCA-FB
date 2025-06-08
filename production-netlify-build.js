#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function productionBuild() {
  try {
    console.log('Building full CUCA app for production deployment...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create production-specific vite config
    const prodViteConfig = `import { defineConfig } from "vite";
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

    fs.writeFileSync(path.join(clientDir, 'vite.config.production.ts'), prodViteConfig);
    
    // Create simplified CSS for production
    const prodCSS = `@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --primary: 51 100% 50%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 10%;
  --accent: 0 0% 96%;
  --accent-foreground: 0 0% 10%;
  --destructive: 0 62% 50%;
  --destructive-foreground: 48 100% 85%;
  --ring: 51 100% 50%;
  --cuca-yellow: 51 100% 50%;
  --cuca-red: 0 100% 45%;
  --cuca-black: 0 0% 0%;
}

.dark {
  --background: 0 0% 3%;
  --foreground: 0 0% 98%;
  --muted: 0 0% 14%;
  --muted-foreground: 0 0% 63%;
  --popover: 0 0% 3%;
  --popover-foreground: 0 0% 98%;
  --card: 0 0% 3%;
  --card-foreground: 0 0% 98%;
  --border: 0 0% 14%;
  --input: 0 0% 14%;
  --primary: 51 100% 50%;
  --primary-foreground: 0 0% 0%;
  --secondary: 0 0% 14%;
  --secondary-foreground: 0 0% 98%;
  --accent: 0 0% 14%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62% 50%;
  --destructive-foreground: 48 100% 85%;
  --ring: 51 100% 50%;
}

body {
  font-family: 'Open Sans', sans-serif;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

.text-cuca-yellow { color: hsl(var(--cuca-yellow)); }
.text-cuca-red { color: hsl(var(--cuca-red)); }
.text-cuca-black { color: hsl(var(--cuca-black)); }
.bg-cuca-yellow { background-color: hsl(var(--cuca-yellow)); }
.bg-cuca-red { background-color: hsl(var(--cuca-red)); }
.bg-cuca-black { background-color: hsl(var(--cuca-black)); }
.border-cuca-yellow { border-color: hsl(var(--cuca-yellow)); }
`;

    fs.writeFileSync(path.join(clientDir, 'src/index.production.css'), prodCSS);
    
    // Build with production config
    console.log('Running production build...');
    execSync('npx vite build --config vite.config.production.ts --mode production', {
      cwd: clientDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    
    // Create Netlify redirects
    const redirects = `/*    /index.html   200`;
    fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
    
    // Verify build
    const indexPath = path.join(distDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      throw new Error('Build verification failed: index.html not found');
    }
    
    console.log('✓ Production build completed successfully');
    console.log('✓ Netlify redirects configured');
    
  } catch (error) {
    console.error('Production build failed:', error.message);
    
    // Fallback to simple build
    console.log('Falling back to simple build...');
    execSync('node simple-netlify-build.js', { stdio: 'inherit' });
  }
}

productionBuild();