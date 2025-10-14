import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

interface DecodedToken extends JwtPayload {
  id?: string;
  email?: string;
  name?: string;
  providerId?: string;
  mobile?: string;
  role?: string;
}

export const verifyTokenHandler = async (
  req: Request & { user?: DecodedToken },
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized, Token Required!' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = (process.env.TOKEN_SECRET_KEY || config.jwtSecret)?.trim();

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        console.error('JWT Verify Error:', err.name, err.message);
        return res.status(401).json({
          message:
            err.name === 'TokenExpiredError'
              ? 'Token expired, please login again.'
              : 'Failed to authenticate token, Invalid token',
        });
      }

      req.user = decoded as DecodedToken;
      next();
    });
  } catch (error) {
    console.error('Token Verification Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }
};
