import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
import config from './src/config';
import routes from './src/routes';
import logger from './src/utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec  from './src/utils/swagger';
import errorHandler from './src/middleware/error.middleware';
import expressValidator from 'express-validator';
// const { body } = expressValidator;
import bodyParser from 'body-parser';


const app = express();


app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(
rateLimit({
windowMs: config.rateLimitWindowMs,
max: config.rateLimitMax,
standardHeaders: true,
legacyHeaders: false,
})
);


app.get('/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api', routes);


app.use(errorHandler);


if (config.nodeEnv !== 'production') {
app.use((req, _res, next) => {
logger.info(`${req.method} ${req.path}`);
next();
});
}


export default app;