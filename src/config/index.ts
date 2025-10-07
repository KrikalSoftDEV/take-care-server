import * as dotenv from 'dotenv';
import * as path from 'path';


dotenv.config({ path: path.resolve(process.cwd(), '.env') });


export default {
port: process.env.PORT || 4000,
mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/myTech-Care-db',
jwtSecret: process.env.JWT_SECRET || 'change-me',
nodeEnv: process.env.NODE_ENV || 'development',
rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
rateLimitMax: Number(process.env.RATE_LIMIT_MAX) || 100,
TOKEN_SECRET_KEY: process.env.TOKEN_SECRET_KEY || 'your-default-token-secret'
};