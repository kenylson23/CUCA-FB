#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildStatic() {
  try {
    console.log('Starting optimized build for Netlify...');
    
    // Ensure dist/public directory exists
    const distDir = path.resolve(__dirname, "dist/public");
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Check if build already exists and has required files
    const indexPath = path.join(distDir, 'index.html');
    const assetsDir = path.join(distDir, 'assets');
    
    if (fs.existsSync(indexPath) && fs.existsSync(assetsDir)) {
      const assets = fs.readdirSync(assetsDir);
      const hasCSS = assets.some(file => file.endsWith('.css'));
      const hasJS = assets.some(file => file.endsWith('.js'));
      
      if (hasCSS && hasJS) {
        console.log('✓ Valid build found, using existing files');
        return;
      }
    }
    
    console.log('Building frontend with Vite...');
    
    // Use the existing vite configuration but with optimizations for speed
    process.env.NODE_ENV = 'production';
    
    // Copy main tailwind config to client directory
    execSync('cp tailwind.config.js client/', {
      stdio: 'inherit'
    });
    
    // Run build command with standard Vite config
    execSync('npx vite build --mode production', {
      cwd: path.resolve(__dirname, 'client'),
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_ENV: 'production'
      }
    });
    
    console.log('✓ Build completed successfully');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    
    // Fallback: try to copy existing build if available
    const existingBuild = path.resolve(__dirname, "dist/public");
    if (fs.existsSync(existingBuild) && fs.readdirSync(existingBuild).length > 0) {
      console.log('Using existing build files as fallback');
      return;
    }
    
    process.exit(1);
  }
}

buildStatic();