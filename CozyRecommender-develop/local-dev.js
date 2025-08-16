#!/usr/bin/env node

// Local development setup script
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up Cozy Recommendations for local development...');

// Check if .env file exists
if (!fs.existsSync('.env')) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync('.env.example', '.env');
    console.log('✅ .env file created! Please edit it with your database credentials.');
    console.log('💡 See LOCAL-SETUP.md for detailed instructions.');
  } catch (error) {
    console.log('⚠️ Could not create .env file. Please create it manually from .env.example');
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed');
  } catch (error) {
    console.log('❌ Failed to install dependencies. Please run: npm install');
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Build the project
console.log('🔨 Building project...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed');
} catch (error) {
  console.log('❌ Build failed. Trying to continue anyway...');
}

console.log('');
console.log('🎉 Setup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Edit .env file with your Supabase credentials');
console.log('2. Run: npm run dev');
console.log('3. Open: http://localhost:5000');
console.log('');
console.log('Need help? Check LOCAL-SETUP.md for troubleshooting.');