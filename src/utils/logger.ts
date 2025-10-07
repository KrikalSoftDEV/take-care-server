import winston from 'winston';


const { combine, timestamp, printf, colorize } = winston.format;


const myFormat = printf(({ level, message, timestamp }) => {
return `${timestamp} [${level}]: ${message}`;
});


const logger = winston.createLogger({
level: 'info',
format: combine(timestamp(), myFormat),
transports: [
new winston.transports.Console({ format: combine(colorize(), timestamp(), myFormat) }),
new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
new winston.transports.File({ filename: 'logs/combined.log' }),
],
});


export default logger;