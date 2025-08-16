import express, { type Request, Response, NextFunction } from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { securityMiddleware } from "./middleware/security";
import { initializeDatabase } from "./db";
import { initializeStorage } from "./storage";

const app = express();

// Security middleware - Applied first for maximum protection
// Temporarily disable helmet for debugging
// app.use(securityMiddleware.headers);
app.use(cors(securityMiddleware.cors));
app.use(securityMiddleware.vulnerabilityCheck);

// Body parsing middleware
app.use(express.json({ limit: '10mb' })); // Limit request size
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Trust proxy settings for accurate IP addresses
app.set('trust proxy', 1);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize database and create tables
    console.log('⏳ Initializing application...');
    await initializeDatabase();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    console.log('ℹ️ Continuing with in-memory storage...');
  }

  // Initialize storage layer
  try {
    console.log('⏳ Initializing storage...');
    await initializeStorage();
    console.log('✅ Storage initialization complete');
  } catch (error) {
    console.error('❌ Storage initialization failed:', error);
    process.exit(1);
  }

  const server = await registerRoutes(app);

  // Enhanced error handling middleware
  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    // Log security-related errors
    if (status === 401 || status === 403 || status === 429) {
      console.log(`🔒 Security Error: ${status} - ${message} from ${req.ip}`);
    } else if (status >= 500) {
      console.error(`❌ Server Error: ${status} - ${message}`);
      console.error(err.stack);
    }

    // Don't expose stack trace in production
    const responseMessage = process.env.NODE_ENV === 'production' && status >= 500
      ? 'Internal Server Error'
      : message;

    res.status(status).json({ 
      error: responseMessage,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  });

  // Serve static files with proper path resolution
  console.log('⚠️ Serving production build due to Vite development server issues');
  try {
    serveStatic(app);
  } catch (staticError) {
    console.error('❌ Static serving failed:', staticError);
    // Try alternative static file serving with correct path
    const path = await import('path');
    const distPublicPath = path.resolve(process.cwd(), 'dist', 'public');
    console.log(`🔄 Trying alternative static path: ${distPublicPath}`);
    
    if (await import('fs').then(fs => fs.existsSync(distPublicPath))) {
      console.log('✅ Found build files, serving from alternative path');
      app.use(express.static(distPublicPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPublicPath, 'index.html'));
      });
    } else {
      // Last resort fallback
      app.get('*', (req, res) => {
        res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Cozy - AI-Powered Recommendations</title>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body>
              <div>
                <h1>Cozy Recommendations</h1>
                <p>Build files not found. Please run: npm run build</p>
                <p>Expected path: ${distPublicPath}</p>
              </div>
            </body>
          </html>
        `);
      });
    }
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 3000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
