#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function simpleBuild() {
  try {
    console.log('Building CUCA app with simplified configuration...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    const clientDir = path.resolve(__dirname, 'client');
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Create a simple index.html for testing
    const simpleHTML = `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CUCA - A Cerveja Nacional de Angola</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #FFD700, #FFA500);
            min-height: 100vh;
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }
        .container {
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            max-width: 600px;
        }
        .logo {
            font-size: 3rem;
            font-weight: bold;
            color: #FFD700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            margin-bottom: 1rem;
        }
        .subtitle {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            color: #666;
        }
        .message {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1.5rem;
        }
        .status {
            color: #28a745;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">CUCA</div>
        <div class="subtitle">A Cerveja Nacional de Angola</div>
        <div class="message">
            <p>🍺 Bem-vindo ao site da CUCA!</p>
            <p class="status">✓ Aplicação funcionando no Netlify</p>
        </div>
        <p>Em Angola, cerveja é CUCA.<br>
        Tradição de mais de 50 anos.</p>
        <p><small>Site em desenvolvimento - Deploy realizado com sucesso</small></p>
    </div>
</body>
</html>`;
    
    // Write simple HTML file
    fs.writeFileSync(path.join(distDir, 'index.html'), simpleHTML);
    
    // Create a simple _redirects file for Netlify
    const redirects = `/*    /index.html   200`;
    fs.writeFileSync(path.join(distDir, '_redirects'), redirects);
    
    console.log('✓ Simple build completed successfully');
    console.log('✓ index.html created');
    console.log('✓ _redirects file created');
    
  } catch (error) {
    console.error('Simple build failed:', error.message);
    process.exit(1);
  }
}

simpleBuild();