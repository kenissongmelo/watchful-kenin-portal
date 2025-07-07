import express from 'express';
import { createRouter } from './router';
import { Logger } from 'winston';

export async function createKeninDutyServer(logger: Logger) {
  const app = express();
  
  // Middleware
  app.use(express.json());
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, { 
      query: req.query, 
      body: req.body 
    });
    next();
  });

  // CORS headers
  app.use((req, res, next) => {
    // Allow specific origin instead of wildcard when credentials are included
    const origin = req.headers.origin;
    if (origin && (origin.includes('localhost:3000') || origin.includes('localhost:3001'))) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Create and mount the KeninDuty router
  const keninDutyRouter = await createRouter({ logger });
  app.use('/api/keninduty', keninDutyRouter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      service: 'kenin-duty-api'
    });
  });

  return app;
} 