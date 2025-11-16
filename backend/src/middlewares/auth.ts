import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

interface JwtPayload {
  id: string;
}

export default async function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = user as IUserDocument;
    next();
  } catch (err) {
    console.error('Auth error', err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
