#!/usr/bin/env node

// Local server startup script with port detection
import { execSync } from 'child_process';
import { createServer } from 'http';

// Function to check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

// Function to find available port
async function findAvailablePort(startPort = 3000) {
  for (let port = startPort; port <= startPort + 100; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error('No available ports found');
}

async function startServer() {
  console.log('🔍 Finding available port...');
  
  // Check common development ports
  const preferredPorts = [3000, 3001, 5000, 5001, 8000, 8080];
  let availablePort = null;
  
  for (const port of preferredPorts) {
    if (await isPortAvailable(port)) {
      availablePort = port;
      break;
    }
  }
  
  if (!availablePort) {
    availablePort = await findAvailablePort(3000);
  }
  
  console.log(`✅ Using port ${availablePort}`);
  console.log(`🌐 Server will be available at: http://localhost:${availablePort}`);
  
  // Set port environment variable
  process.env.PORT = availablePort.toString();
  
  // Start the development server
  try {
    execSync(`cross-env PORT=${availablePort} NODE_ENV=development tsx server/index.ts`, { 
      stdio: 'inherit',
      env: { ...process.env, PORT: availablePort.toString() }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Make sure dependencies are installed: npm install');
    console.log('2. Build the project first: npm run build');
    console.log('3. Check if another process is using ports');
    console.log('4. Try: npm run dev (alternative method)');
  }
}

startServer().catch(console.error);