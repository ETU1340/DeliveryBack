import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ajouter les propriétés personnalisées à l'interface Request

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('x-auth-token');
    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.userConnected = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: true, message: 'Token expired. Please log in again.' });
        } else {
            return res.status(401).json({ error: true, msg: 'Token is not valid' });
        }
    }
};

export default authMiddleware;
