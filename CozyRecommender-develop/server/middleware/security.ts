import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import crypto from 'crypto';
// Import db dynamically to avoid circular dependencies
let db: any;
let supabase: any;

const initializeDb = async () => {
  try {
    const dbModule = await import('../db.js');
    db = dbModule.db;
    supabase = dbModule.supabase;
  } catch (error) {
    console.log('Database not available in security middleware');
  }
};

// Initialize database connection
initializeDb();

// Rate limiting configurations
export const createRateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100, // limit each IP to 100 requests per windowMs
  message: string = 'Too many requests from this IP, please try again later.'
) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req: Request, res: Response) => {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', req, { limit: max, window: windowMs });
      res.status(429).json({ error: message });
    },
  });
};

// Specific rate limiters for different endpoints
export const authRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 authentication attempts per 15 minutes
  'Too many authentication attempts, please try again after 15 minutes.'
);

export const apiRateLimit = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'API rate limit exceeded, please slow down your requests.'
);

export const strictRateLimit = createRateLimiter(
  60 * 1000, // 1 minute
  10, // 10 requests per minute
  'Too many requests, please wait a minute before trying again.'
);

// Security headers configuration - simplified for development
export const securityHeaders = helmet({
  contentSecurityPolicy: false, // Disable CSP for development to avoid conflicts
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  } : false, // Disable HSTS in development
});

// Input validation middleware
export const validateInput = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Log validation errors
    logSecurityEvent('VALIDATION_ERROR', req, { errors: errors.array() });

    res.status(400).json({
      error: 'Invalid input',
      details: errors.array().map(err => ({
        field: (err as any).param || (err as any).path || 'unknown',
        message: err.msg,
      })),
    });
  };
};

// Common validation rules
export const userValidation = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, hyphens, and underscores')
    .trim()
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

export const recommendationValidation = [
  body('type')
    .isIn(['movie', 'book', 'music'])
    .withMessage('Type must be movie, book, or music'),
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters')
    .trim()
    .escape(),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters')
    .trim(),
  body('mood')
    .optional()
    .isIn(['relaxed', 'energetic', 'creative', 'nostalgic', 'romantic', 'adventurous', 'mysterious', 'uplifting', 'contemplative', 'festive'])
    .withMessage('Invalid mood specified'),
];

// Authentication middleware
export const requireAuth = (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const sessionToken = req.headers['x-session-token'] as string;

  if (!authHeader && !sessionToken) {
    logSecurityEvent('UNAUTHORIZED_ACCESS', req, { reason: 'No auth header or session token' });
    return res.status(401).json({ error: 'Authentication required' });
  }

  // For now, use simple authentication
  // In production, implement proper JWT or session validation
  next();
};

// SQL injection prevention
export const sanitizeSQL = (input: string): string => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous SQL keywords and characters
  return input
    .replace(/['"`;\\]/g, '') // Remove quotes, semicolons, backslashes
    .replace(/\b(DROP|DELETE|TRUNCATE|ALTER|CREATE|INSERT|UPDATE|EXEC|EXECUTE)\b/gi, '') // Remove dangerous SQL keywords
    .trim();
};

// XSS prevention
export const sanitizeHTML = (input: string): string => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=\s*['"]/gi, '') // Remove event handlers
    .trim();
};

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:5000',
      'https://*.replit.app',
      'https://*.repl.co',
      'https://*.spock.replit.dev',
      process.env.FRONTEND_URL,
    ].filter(Boolean);

    // Allow requests with no origin (mobile apps, etc)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin && allowedOrigin.includes('*')) {
        const regex = new RegExp(allowedOrigin.replace(/\*/g, '.*'));
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      // Temporarily allow all origins for development
      console.log(`⚠️ CORS: Allowing origin ${origin} for development`);
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// Security event logging
export async function logSecurityEvent(
  action: string,
  req: Request,
  metadata: any = {}
) {
  const logEntry = {
    action,
    ip_address: req.ip || (req.connection && req.connection.remoteAddress) || 'Unknown',
    user_agent: (req.get && req.get('User-Agent')) || (req.headers && req.headers['user-agent']) || 'Unknown',
    endpoint: req.path || req.url || 'Unknown',
    method: req.method || 'Unknown',
    metadata,
    timestamp: new Date().toISOString(),
  };

  // Log to console for immediate visibility
  console.log(`🔒 SECURITY EVENT: ${action}`, logEntry);

  // Store in database if available
  try {
    if (db) {
      await db.execute(`
        INSERT INTO audit_logs (action, resource_type, ip_address, user_agent, new_values, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
      `, [action, 'security_event', logEntry.ip_address, logEntry.user_agent, JSON.stringify(metadata)]);
    }
  } catch (error) {
    console.error('Failed to log security event to database:', error);
  }
}

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12; // High salt rounds for security
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// Session management
export interface SessionData {
  userId: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
  ipAddress: string;
  userAgent: string;
}

export const createSession = async (
  userId: string,
  username: string,
  req: Request
): Promise<string> => {
  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const sessionData: SessionData = {
    userId,
    username,
    createdAt: new Date(),
    expiresAt,
    ipAddress: req.ip || 'unknown',
    userAgent: req.get('User-Agent') || 'unknown',
  };

  try {
    if (db) {
      await db.execute(`
        INSERT INTO user_sessions (user_id, session_token, expires_at, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, sessionToken, expiresAt, sessionData.ipAddress, sessionData.userAgent]);
    }
    
    logSecurityEvent('SESSION_CREATED', req, { userId, sessionToken: sessionToken.substring(0, 8) + '...' });
  } catch (error) {
    console.error('Failed to create session:', error);
    throw new Error('Session creation failed');
  }

  return sessionToken;
};

export const validateSession = async (sessionToken: string): Promise<SessionData | null> => {
  try {
    if (!db) return null;

    const result = await db.execute(`
      SELECT s.*, u.username
      FROM user_sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = $1 AND s.expires_at > NOW() AND s.is_active = true
    `, [sessionToken]);

    const session = result.rows?.[0];
    if (!session) return null;

    return {
      userId: session.user_id,
      username: session.username,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
      ipAddress: session.ip_address,
      userAgent: session.user_agent,
    };
  } catch (error) {
    console.error('Session validation error:', error);
    return null;
  }
};

// Vulnerability assessment middleware
export const vulnerabilityCheck = (req: Request, res: Response, next: NextFunction) => {
  const suspiciousPatterns = [
    /union\s+select/i, // SQL injection
    /<script/i, // XSS
    /javascript:/i, // XSS
    /\.\.\//g, // Path traversal
    /\bexec\b/i, // Command injection
    /\beval\b/i, // Code injection
    /\$\{/g, // Template injection
  ];

  const checkInput = (obj: any, path: string = ''): boolean => {
    if (typeof obj === 'string') {
      return suspiciousPatterns.some(pattern => pattern.test(obj));
    } else if (obj && typeof obj === 'object') {
      return Object.entries(obj).some(([key, value]) => 
        checkInput(value, path ? `${path}.${key}` : key)
      );
    }
    return false;
  };

  const hasSuspiciousContent = 
    checkInput(req.body) ||
    checkInput(req.query) ||
    checkInput(req.params);

  if (hasSuspiciousContent) {
    logSecurityEvent('SUSPICIOUS_INPUT_DETECTED', req, {
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    return res.status(400).json({
      error: 'Invalid request detected',
      message: 'Your request contains potentially harmful content',
    });
  }

  next();
};

// Export all security middleware as a bundle
export const securityMiddleware = {
  headers: securityHeaders,
  rateLimit: {
    auth: authRateLimit,
    api: apiRateLimit,
    strict: strictRateLimit,
  },
  validation: {
    user: validateInput(userValidation),
    recommendation: validateInput(recommendationValidation),
  },
  auth: requireAuth,
  vulnerabilityCheck,
  cors: corsOptions,
};