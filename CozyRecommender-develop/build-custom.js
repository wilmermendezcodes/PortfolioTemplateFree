#!/usr/bin/env node

// Custom build script that completely bypasses Vite's problematic path resolution
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting custom build for Vercel...');

try {
  // 0. Debug environment
  console.log('🔍 Debugging build environment...');
  console.log(`📁 Working directory: ${process.cwd()}`);
  
  // List project structure
  const listDir = (dirPath, prefix = '') => {
    try {
      if (fs.existsSync(dirPath)) {
        const items = fs.readdirSync(dirPath);
        items.slice(0, 10).forEach(item => {
          const itemPath = path.resolve(dirPath, item);
          const stats = fs.statSync(itemPath);
          console.log(`${prefix}${stats.isDirectory() ? '📁' : '📄'} ${item}`);
        });
        if (items.length > 10) {
          console.log(`${prefix}... and ${items.length - 10} more items`);
        }
      } else {
        console.log(`${prefix}❌ Directory not found: ${dirPath}`);
      }
    } catch (e) {
      console.log(`${prefix}❌ Error listing ${dirPath}: ${e.message}`);
    }
  };
  
  console.log('📂 Root directory:');
  listDir(process.cwd(), '  ');
  
  console.log('📂 Client directory:');
  listDir(path.resolve(process.cwd(), 'client'), '  ');
  
  console.log('📂 Client/src directory:');
  listDir(path.resolve(process.cwd(), 'client', 'src'), '  ');
  
  // More detailed client/src listing
  const clientSrcPath = path.resolve(process.cwd(), 'client', 'src');
  if (fs.existsSync(clientSrcPath)) {
    const files = fs.readdirSync(clientSrcPath);
    console.log('📂 All files in client/src:');
    files.forEach(file => {
      const filePath = path.resolve(clientSrcPath, file);
      const stats = fs.statSync(filePath);
      console.log(`  ${stats.isDirectory() ? '📁' : '📄'} ${file}`);
    });
  }

  // 1. Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // 2. Create build directories
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(distDir, 'public');
  const assetsDir = path.resolve(publicDir, 'assets');

  // Clean and create directories
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(assetsDir, { recursive: true });

  // 3. Build the React application with esbuild
  console.log('🔨 Building React application...');
  
  // Find the correct main file path
  let mainTsxPath = path.resolve(process.cwd(), 'client', 'src', 'main.tsx');
  if (!fs.existsSync(mainTsxPath)) {
    // Try alternative paths
    const altPaths = [
      path.resolve(process.cwd(), 'client', 'main.tsx'),
      path.resolve(process.cwd(), 'src', 'main.tsx'),
      path.resolve(process.cwd(), 'client', 'index.tsx')
    ];
    
    for (const altPath of altPaths) {
      if (fs.existsSync(altPath)) {
        mainTsxPath = altPath;
        break;
      }
    }
  }
  
  console.log(`📁 Main file path: ${mainTsxPath}`);
  console.log(`📁 Main file exists: ${fs.existsSync(mainTsxPath)}`);
  
  if (!fs.existsSync(mainTsxPath)) {
    throw new Error(`Main TypeScript file not found at ${mainTsxPath}`);
  }
  
  const outputJsPath = path.resolve(assetsDir, 'index.js');
  const outputCssPath = path.resolve(assetsDir, 'index.css');
  
  // Build JavaScript with esbuild
  console.log('🔍 Checking esbuild availability...');
  
  // Try multiple paths to find esbuild
  let esbuildCommand = null;
  const possiblePaths = [
    path.resolve(process.cwd(), 'node_modules', '.bin', 'esbuild'),
    path.resolve(process.cwd(), 'node_modules', 'esbuild', 'bin', 'esbuild'),
    'npx esbuild'
  ];
  
  for (const cmdPath of possiblePaths) {
    if (cmdPath === 'npx esbuild') {
      // Try npx as last resort
      try {
        execSync('which esbuild', { stdio: 'pipe' });
        esbuildCommand = 'npx esbuild';
        console.log('✓ Found esbuild via npx');
        break;
      } catch (e) {
        console.log('⚠️ npx esbuild not available');
      }
    } else if (fs.existsSync(cmdPath)) {
      esbuildCommand = `"${cmdPath}"`;
      console.log(`✓ Found esbuild at ${cmdPath}`);
      break;
    }
  }
  
  if (!esbuildCommand) {
    console.log('❌ esbuild not found, falling back to simple build');
    throw new Error('ESBUILD_NOT_FOUND');
  }
  
  const buildCmd = `${esbuildCommand} "${mainTsxPath}" --bundle --outfile="${outputJsPath}" --format=esm --minify --jsx=automatic --define:process.env.NODE_ENV='"production"' --loader:.css=css --loader:.tsx=tsx --loader:.ts=ts --target=es2020`;
  
  console.log('📦 Build command:', buildCmd);
  execSync(buildCmd, {
    stdio: 'inherit'
  });

  // 4. Process and copy HTML file
  console.log('📄 Processing HTML file...');
  let originalHtmlPath = path.resolve(process.cwd(), 'client', 'index.html');
  
  // Check if HTML file exists, try alternative paths
  if (!fs.existsSync(originalHtmlPath)) {
    const altHtmlPaths = [
      path.resolve(process.cwd(), 'index.html'),
      path.resolve(process.cwd(), 'public', 'index.html')
    ];
    
    for (const altPath of altHtmlPaths) {
      if (fs.existsSync(altPath)) {
        originalHtmlPath = altPath;
        break;
      }
    }
  }
  
  console.log(`📁 HTML file path: ${originalHtmlPath}`);
  console.log(`📁 HTML file exists: ${fs.existsSync(originalHtmlPath)}`);
  
  if (!fs.existsSync(originalHtmlPath)) {
    throw new Error(`HTML file not found at ${originalHtmlPath}`);
  }
  
  const outputHtmlPath = path.resolve(publicDir, 'index.html');
  
  let htmlContent = fs.readFileSync(originalHtmlPath, 'utf-8');
  
  // Replace the problematic script tag
  htmlContent = htmlContent.replace(
    '<script type="module" src="/src/main.tsx"></script>',
    '<script type="module" src="/assets/index.js"></script>'
  );
  
  // Add CSS link if the file exists
  if (fs.existsSync(outputCssPath)) {
    htmlContent = htmlContent.replace(
      '</head>',
      '    <link rel="stylesheet" href="/assets/index.css">\n  </head>'
    );
  }
  
  // Remove replit development banner for production
  htmlContent = htmlContent.replace(
    '    <script type="text/javascript" src="https://replit.com/public/js/replit-dev-banner.js"></script>',
    ''
  );
  
  fs.writeFileSync(outputHtmlPath, htmlContent);

  // 5. Copy CSS file if it exists
  const originalCssPath = path.resolve(process.cwd(), 'client', 'src', 'index.css');
  if (fs.existsSync(originalCssPath)) {
    console.log('🎨 Copying CSS file...');
    fs.copyFileSync(originalCssPath, outputCssPath);
  }

  // 6. Copy any static assets from client/public if they exist
  const clientPublicPath = path.resolve(process.cwd(), 'client', 'public');
  if (fs.existsSync(clientPublicPath)) {
    console.log('📁 Copying static assets...');
    const files = fs.readdirSync(clientPublicPath);
    files.forEach(file => {
      const srcPath = path.resolve(clientPublicPath, file);
      const destPath = path.resolve(publicDir, file);
      if (fs.statSync(srcPath).isFile()) {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  // 7. Build API function for Vercel
  console.log('⚙️ Building API function...');
  const apiDir = path.resolve(process.cwd(), 'api');
  if (!fs.existsSync(apiDir)) {
    fs.mkdirSync(apiDir, { recursive: true });
  }
  
  execSync(`${esbuildCommand} api/index.ts --platform=node --packages=external --bundle --format=esm --outdir=api --out-extension:.js=.js`, {
    stdio: 'inherit'
  });

  // 8. Verify build outputs
  console.log('✅ Build completed successfully!');
  console.log('📊 Build verification:');
  
  const htmlExists = fs.existsSync(outputHtmlPath);
  const jsExists = fs.existsSync(outputJsPath);
  const apiExists = fs.existsSync(path.resolve(apiDir, 'index.js'));
  
  console.log(`   - HTML: ${htmlExists ? '✓' : '✗'} ${outputHtmlPath}`);
  console.log(`   - JavaScript: ${jsExists ? '✓' : '✗'} ${outputJsPath}`);
  console.log(`   - API Function: ${apiExists ? '✓' : '✗'} api/index.js`);
  
  if (jsExists) {
    const jsStats = fs.statSync(outputJsPath);
    console.log(`   - Bundle size: ${(jsStats.size / 1024).toFixed(2)}KB`);
  }
  
  if (!htmlExists || !jsExists) {
    throw new Error('Critical build files missing');
  }

  console.log('🎉 All files built successfully for Vercel deployment!');
  
} catch (error) {
  if (error.message === 'ESBUILD_NOT_FOUND') {
    console.log('🔄 Switching to simple build...');
    
    // Execute the simple build as fallback
    try {
      const { execSync } = await import('child_process');
      execSync('node vercel-build-simple.js', { stdio: 'inherit' });
      console.log('✅ Fallback build completed successfully!');
    } catch (fallbackError) {
      console.error('❌ Both builds failed:', fallbackError);
      process.exit(1);
    }
  } else {
    console.error('❌ Build failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}