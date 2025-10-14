import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import path from 'path';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import config from './config';
import routes from './routes';
import logger from './utils/logger';
import swaggerSpec from './utils/swagger';
import errorHandler from './middleware/error.middleware';


dotenv.config();

const app = express();
export const PORT = process.env.PORT || 4000;



app.use(helmet());
app.use(cors());
app.use(compression());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// app.use(mongoSanitize());

app.use(
  rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMax,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const allowedOrigins: string[] = ['*'];

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin as string;
  const requestMethod = req.method;
  const requestHeaders = req.headers['access-control-request-headers'] as string;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, X-Foo, X-Bar');
    res.setHeader('Access-Control-Max-Age', '86400');


    if (requestMethod === 'OPTIONS') {
      if (requestHeaders) {
        res.setHeader('Access-Control-Allow-Headers', requestHeaders);
      }
      return res.status(200).end();
    }
  }

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// app.set('trust proxy', true);

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, originalUrl } = req;
  console.log(`\n➡️  HIT: ${method} ${originalUrl}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `✅ DONE: ${method} ${originalUrl} -> ${res.statusCode} (${duration}ms)\n`
    );
  });
  next();
});




app.get('/', (req: Request, res: Response) =>
  res.status(200).send('Welcome to the tech-care API server!')
);

app.get('/api/health', (_req: Request, res: Response) =>
  res.status(200).json({ status: 'OK', time: new Date().toISOString() })
);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/v1/api', routes);

app.use((req: Request, res: Response) => {
  const notFoundMessage = `Route not found: ${req.method} ${req.originalUrl}`;
  console.error(`\n🔎 404 NOT FOUND`);
  console.error(`📍 URL: ${req.method} ${req.originalUrl}`);
  console.error(`📦 Headers:`, req.headers);
  console.error(`🔎 404 END\n`);
  return res.status(404).json({
    title: 'Not Found',
    message: notFoundMessage,
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
  app.get('*', (_req, res) =>
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
  );
}

app.use(errorHandler);



export default app;
