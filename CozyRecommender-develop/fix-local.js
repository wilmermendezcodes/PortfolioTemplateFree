#!/usr/bin/env node

// Fix for local development "Application is starting up" issue
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔧 Fixing local development setup...');

// Step 1: Check if build files exist
const distPath = path.join(process.cwd(), 'dist', 'public');
console.log(`📁 Checking build directory: ${distPath}`);

if (!fs.existsSync(distPath)) {
  console.log('❌ Build directory missing. Building now...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Build directory exists');
}

// Step 2: Check if index.html exists in dist/public
const indexPath = path.join(distPath, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.log('❌ index.html missing. Rebuilding...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Rebuild completed');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ index.html exists');
}

// Step 3: Create/check .env file
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file...');
  const envContent = `NODE_ENV=development
PORT=3000
# Add your database credentials here if needed
# DATABASE_URL=your_connection_string
# SUPABASE_URL=your_supabase_url
# SUPABASE_ANON_KEY=your_supabase_key
`;
  fs.writeFileSync('.env', envContent);
  console.log('✅ .env file created');
} else {
  console.log('✅ .env file exists');
}

// Step 4: Start the server
console.log('🚀 Starting development server...');
console.log('🌐 Your app will be available at: http://localhost:3000');
console.log('📱 If that doesn\'t work, also try: http://127.0.0.1:3000');

try {
  execSync('npm run dev', { 
    stdio: 'inherit',
    env: { ...process.env, PORT: '3000', NODE_ENV: 'development' }
  });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  console.log('\n🔧 Try these troubleshooting steps:');
  console.log('1. Delete dist folder: rm -rf dist');
  console.log('2. Rebuild: npm run build');
  console.log('3. Start again: npm run dev');
}