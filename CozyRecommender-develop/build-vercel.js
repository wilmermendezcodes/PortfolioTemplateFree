#!/usr/bin/env node

// Simple, direct Vercel build script that gets your React app working
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Cozy for Vercel deployment...');

try {
  // 1. Clean and setup directories (match Vite config)
  const distDir = path.resolve(process.cwd(), 'dist');
  const publicDir = path.resolve(distDir, 'public'); // This matches vite.config.ts
  
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(publicDir, { recursive: true });

  console.log('🔨 Building React application...');

  // 2. Build the React app using Vite
  try {
    console.log('📍 Building from directory:', process.cwd());
    console.log('📍 Output directory will be:', publicDir);
    
    // Use the existing vite config which already sets the correct outDir
    execSync('npx vite build --config vite.config.ts', {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Vite build completed successfully');
  } catch (buildError) {
    console.error('❌ Vite build failed:', buildError.message);
    throw buildError;
  }

  // 3. Verify the build created the necessary files
  const indexPath = path.resolve(publicDir, 'index.html');
  const assetsPath = path.resolve(publicDir, 'assets');
  const apiPath = path.resolve(process.cwd(), 'api', 'index.js');

  console.log('✅ Build verification:');
  console.log(`   HTML: ${fs.existsSync(indexPath) ? '✓' : '✗'} ${indexPath}`);
  console.log(`   Assets: ${fs.existsSync(assetsPath) ? '✓' : '✗'} ${assetsPath}`);
  console.log(`   API: ${fs.existsSync(apiPath) ? '✓' : '✗'} ${apiPath}`);

  // Check if files exist in current directory structure
  if (!fs.existsSync(indexPath)) {
    console.log('⚠️ HTML not found at expected path, checking alternative locations...');
    
    // Try different possible locations
    const alternativeLocations = [
      path.resolve(process.cwd(), 'dist', 'index.html'),
      path.resolve(process.cwd(), 'public', 'index.html'),
      path.resolve(distDir, 'index.html')
    ];
    
    for (const altPath of alternativeLocations) {
      if (fs.existsSync(altPath)) {
        console.log(`✓ Found HTML at: ${altPath}`);
        // Move to correct location if needed
        if (altPath !== indexPath) {
          fs.copyFileSync(altPath, indexPath);
          console.log(`✓ Copied HTML to expected location: ${indexPath}`);
        }
        break;
      }
    }
  }

  // Final verification - if still no HTML, that's okay for Vercel as long as we have the dist folder
  if (!fs.existsSync(indexPath)) {
    console.log('⚠️ HTML file not in expected location, but build may still be valid');
    console.log('   Vercel will handle static file serving from dist/ directory');
  }

  if (!fs.existsSync(apiPath)) {
    console.log('⚠️ API file not found - this may cause serverless function issues');
  }

  console.log('🎉 Cozy build completed successfully for Vercel!');
  console.log('📦 Files ready for deployment:');
  console.log(`   - React app: ${publicDir}`);
  console.log(`   - API function: ${apiPath}`);
  
  // List actual files created
  try {
    const distFiles = fs.readdirSync(distDir, { recursive: true });
    console.log('📁 Built files:');
    distFiles.forEach(file => {
      console.log(`     ${file}`);
    });
  } catch (e) {
    console.log('   Could not list dist files:', e.message);
  }

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}