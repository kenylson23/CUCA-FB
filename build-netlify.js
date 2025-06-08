#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildForNetlify() {
  try {
    console.log('Building CUCA app for Netlify deployment...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Build only the client for static deployment
    console.log('Building client for static deployment...');
    execSync(`cd ${clientDir} && npx vite build --config vite.config.static.js`, { stdio: 'inherit' });
    
    // Verify build output
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log('✓ Build successful - index.html created');
      
      // Add error boundary script to handle any remaining issues
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      const updatedIndex = indexContent.replace(
        '</head>',
        `  <script>
    // Error boundary for Netlify deployment
    window.addEventListener('error', function(e) {
      console.warn('Handled error in static deployment:', e.error);
    });
    
    window.addEventListener('unhandledrejection', function(e) {
      console.warn('Handled promise rejection in static deployment:', e.reason);
      e.preventDefault();
    });
  </script>
</head>`
      );
      
      fs.writeFileSync(indexPath, updatedIndex);
      console.log('✓ Added error handling for static deployment');
      
      // List build contents
      const files = fs.readdirSync(distDir);
      console.log('Build contents:', files);
    } else {
      throw new Error('Build failed - index.html not found');
    }
    
    console.log('🎉 Netlify build completed successfully!');
    console.log('📁 Ready for deployment in: dist/public');
    
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildForNetlify();