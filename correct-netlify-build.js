#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function correctNetlifyBuild() {
  try {
    console.log('Building the actual CUCA React app for Netlify deployment...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Build the actual React app using optimized Netlify config
    console.log('Building React application with optimized config...');
    execSync(`cd ${clientDir} && npx vite build --config vite.config.netlify.js`, { stdio: 'inherit' });
    
    // Add Netlify specific files
    const redirectsContent = `/*    /index.html   200`;
    fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent);
    
    // Verify build output
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ React build successful - index.html created');
      
      // Read and verify the generated HTML contains React mounting point
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      if (indexContent.includes('id="root"') && indexContent.includes('/src/main.tsx')) {
        console.log('✓ React application properly configured');
      }
      
      // List build contents
      const files = fs.readdirSync(distDir);
      console.log('Build contents:', files);
      
      // Check for assets directory
      const assetsDir = path.join(distDir, 'assets');
      if (fs.existsSync(assetsDir)) {
        const assetFiles = fs.readdirSync(assetsDir);
        console.log(`✓ Assets directory found with ${assetFiles.length} files`);
      }
      
    } else {
      throw new Error('Build failed - index.html not found');
    }
    
    console.log('🎉 Correct Netlify build completed successfully!');
    console.log('📁 Your actual CUCA React app is ready for deployment in: dist/public');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

correctNetlifyBuild();