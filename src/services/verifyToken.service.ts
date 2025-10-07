import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config'; // your config file with TOKEN_SECRET_KEY
import redis from '../config/redis'; // if you need redis later

interface DecodedToken {
  id: string;
  email?: string;
  name?:String,
  userId?:String,
  mobile?:String,
}

export const verifyTokenHandler = async (
  req: Request & { user?: DecodedToken },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let authTokenHeader = req.headers.authorization || req.headers.Authorization;

    if (!authTokenHeader) {
      const error = new Error('Unauthorized, Token Required!') as any;
      error.statusCode = 401;
      return next(error);
    }

    if (Array.isArray(authTokenHeader)) {
      authTokenHeader = authTokenHeader[0];
    }

    if (!authTokenHeader.startsWith('Bearer ')) {
      const error = new Error("Token format is invalid. Must be 'Bearer [token]'") as any;
      error.statusCode = 401;
      return next(error);
    }

    const token = authTokenHeader.split(' ')[1];

    jwt.verify(token, process.env.TOKEN_SECRET_KEY || config.TOKEN_SECRET_KEY, (err, decoded) => {
      if (err) {
        const error = new Error('Failed to authenticate token, Invalid token') as any;
        error.statusCode = 401;
        return next(error);
      }

      req.user = decoded as DecodedToken;
      return next();
    });

  } catch (err) {
    next(err);
  }
};
