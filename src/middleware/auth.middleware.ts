import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

export interface AuthRequest extends Request {
  user?: {
    _id?: string;
    id?: string;      
    email?: string;
    name?: string;
    role?: string;
    userId?: string;
    mobile?: string;
  };
}


export const createTokenHandler = (user: AuthRequest['user']): string => {
  return jwt.sign(user!, process.env.TOKEN_SECRET_KEY || config.jwtSecret, {
    expiresIn: '1d',
  });
};

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header) return res.status(401).json({ message: 'Authorization header missing' });

  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ message: 'Invalid authorization format' });

  try {
    const payload = jwt.verify(parts[1], process.env.TOKEN_SECRET_KEY || config.jwtSecret) as AuthRequest['user'];
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
