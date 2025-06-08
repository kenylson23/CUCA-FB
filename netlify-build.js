#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildForNetlify() {
  try {
    console.log('Building CUCA app for Netlify deployment...');
    
    // Set required environment variables for the build
    process.env.NODE_ENV = 'production';
    process.env.VITE_BUILD_TARGET = 'netlify';
    
    // Ensure client directory exists
    const clientDir = path.resolve(__dirname, 'client');
    if (!fs.existsSync(clientDir)) {
      throw new Error('Client directory not found');
    }
    
    // Clean previous builds
    const distDir = path.resolve(__dirname, "dist/public");
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    
    // Create dist directory
    fs.mkdirSync(distDir, { recursive: true });
    
    console.log('Running Vite build...');
    
    // Copy main tailwind config for netlify build
    execSync('cp ../tailwind.config.js tailwind.config.js', {
      cwd: clientDir,
      stdio: 'inherit'
    });
    
    // Build with the correct Vite config for Netlify
    execSync('npx vite build --config vite.config.netlify.ts --mode production', {
      cwd: clientDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production',
        VITE_BUILD_TARGET: 'netlify'
      }
    });
    
    // Verify the build was successful
    const indexPath = path.join(distDir, 'index.html');
    const assetsDir = path.join(distDir, 'assets');
    
    if (!fs.existsSync(indexPath)) {
      throw new Error('Build failed: index.html not generated');
    }
    
    if (!fs.existsSync(assetsDir)) {
      throw new Error('Build failed: assets directory not generated');
    }
    
    const assets = fs.readdirSync(assetsDir);
    const hasCSS = assets.some(file => file.endsWith('.css'));
    const hasJS = assets.some(file => file.endsWith('.js'));
    
    if (!hasCSS || !hasJS) {
      throw new Error('Build failed: Missing CSS or JS files');
    }
    
    console.log('✓ Build completed successfully for Netlify');
    console.log(`✓ Generated ${assets.length} asset files`);
    
  } catch (error) {
    console.error('Netlify build failed:', error.message);
    process.exit(1);
  }
}

buildForNetlify();