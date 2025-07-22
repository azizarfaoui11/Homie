import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || '';

export const auth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Authentification requise' });
      return;
    }

    // Décoder le token avec le rôle
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };

    // Ajouter l'utilisateur décodé à la requête
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
