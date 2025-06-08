#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function quickBuild() {
  try {
    console.log('Quick build for Netlify...');
    
    const distDir = path.resolve(__dirname, "dist/public");
    
    // Clean and create dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
    fs.mkdirSync(distDir, { recursive: true });
    
    // Use existing client build if available, otherwise create minimal version
    const clientBuildDir = path.resolve(__dirname, "client/dist");
    
    if (fs.existsSync(clientBuildDir)) {
      console.log('Copying existing client build...');
      execSync(`cp -r ${clientBuildDir}/* ${distDir}/`, { stdio: 'inherit' });
    } else {
      console.log('Creating minimal CUCA landing page...');
      
      const indexHTML = `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CUCA - Em Angola, cerveja é CUCA</title>
    <meta name="description" content="CUCA - A cerveja nacional de Angola. Tradição de mais de 50 anos, qualidade premium e sabor autêntico.">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      body { font-family: 'Open Sans', sans-serif; }
      .cuca-yellow { color: #FFD700; }
      .bg-cuca-yellow { background-color: #FFD700; }
      .hero-bg { 
        background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23FFD700" width="1200" height="600"/><circle fill="%23FFA500" cx="200" cy="150" r="80"/><circle fill="%23FF8C00" cx="800" cy="400" r="100"/></svg>');
        background-size: cover;
      }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-lg fixed w-full z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <h1 class="text-2xl font-bold cuca-yellow">CUCA</h1>
                </div>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#home" class="text-gray-700 hover:text-yellow-600">Início</a>
                    <a href="#produtos" class="text-gray-700 hover:text-yellow-600">Produtos</a>
                    <a href="#historia" class="text-gray-700 hover:text-yellow-600">História</a>
                    <a href="#pontos-venda" class="text-gray-700 hover:text-yellow-600">Pontos de Venda</a>
                    <a href="#contato" class="text-gray-700 hover:text-yellow-600">Contato</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-bg min-h-screen flex items-center justify-center text-white">
        <div class="text-center max-w-4xl mx-auto px-4">
            <h1 class="text-5xl md:text-7xl font-bold mb-6 font-montserrat">
                Em Angola, cerveja é <span class="cuca-yellow">CUCA</span>
            </h1>
            <p class="text-xl md:text-2xl mb-8 text-gray-200">
                Tradição de mais de 50 anos. Qualidade premium. Sabor autêntico angolano.
            </p>
            <button class="bg-cuca-yellow text-black font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-400 transition-colors">
                Descobrir CUCA
            </button>
        </div>
    </section>

    <!-- Products Section -->
    <section id="produtos" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">Nossos Produtos</h2>
                <p class="text-xl text-gray-600">A qualidade CUCA em cada gole</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="bg-gray-50 rounded-lg p-8 text-center">
                    <div class="w-24 h-24 bg-cuca-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span class="text-3xl">🍺</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">CUCA Original</h3>
                    <p class="text-gray-600">O sabor clássico que conquistou Angola</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-8 text-center">
                    <div class="w-24 h-24 bg-cuca-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span class="text-3xl">🍺</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">CUCA Premium</h3>
                    <p class="text-gray-600">Experiência premium para momentos especiais</p>
                </div>
                <div class="bg-gray-50 rounded-lg p-8 text-center">
                    <div class="w-24 h-24 bg-cuca-yellow rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span class="text-3xl">🍺</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">CUCA Light</h3>
                    <p class="text-gray-600">Leveza sem abrir mão do sabor</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Heritage Section -->
    <section id="historia" class="py-20 bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-4xl font-bold mb-6 cuca-yellow">Nossa História</h2>
                    <p class="text-xl mb-6">
                        Desde 1970, a CUCA representa a essência da cerveja angolana. 
                        Mais de cinco décadas dedicadas à excelência e tradição.
                    </p>
                    <p class="text-lg text-gray-300">
                        Cada garrafa carrega consigo a história e o orgulho de Angola, 
                        mantendo viva a tradição cervejeira que une gerações.
                    </p>
                </div>
                <div class="bg-yellow-500 h-64 rounded-lg flex items-center justify-center">
                    <span class="text-6xl">🏭</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contato" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-4xl font-bold text-gray-900 mb-8">Entre em Contato</h2>
            <p class="text-xl text-gray-600 mb-8">Fale connosco e faça parte da família CUCA</p>
            <button class="bg-cuca-yellow text-black font-bold py-4 px-8 rounded-full text-lg hover:bg-yellow-400 transition-colors">
                Contactar
            </button>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 class="text-3xl font-bold cuca-yellow mb-4">CUCA</h3>
            <p class="text-gray-400 mb-4">A cerveja nacional de Angola</p>
            <p class="text-sm text-gray-500">© 2025 CUCA. Todos os direitos reservados.</p>
        </div>
    </footer>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>`;

      fs.writeFileSync(path.join(distDir, 'index.html'), indexHTML);
    }
    
    // Create Netlify redirects
    fs.writeFileSync(path.join(distDir, '_redirects'), '/*    /index.html   200');
    
    console.log('✓ Netlify build completed successfully');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

quickBuild();