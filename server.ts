import mongoose from 'mongoose';
import app from './src/app';
import config from './src/config';
import logger from './src/utils/logger';
import { PORT } from './src/app';


const start = async () => {
    try {
        const connectWithRetry = async (retries = 5) => {
            try {
                await mongoose.connect(config.mongoUri, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                } as mongoose.ConnectOptions);
                logger.info('MongoDB connected');
            } catch (err) {
                if (retries <= 0) throw err;
                logger.error(`MongoDB connection failed, retrying in 5s... (${retries} left)`);
                await new Promise((r) => setTimeout(r, 5000));
                return connectWithRetry(retries - 1);
            }
        };


        await connectWithRetry();


        app.listen(PORT, () => {
          console.log(`✅ Server running on PORT: ${PORT}`);
          console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
          logger.info(`✅ Server running on PORT: ${PORT}`);
        });
    } catch (err) {
        logger.error('Failed to start server: ' + (err as Error).message);
        process.exit(1);
    }
};


start();