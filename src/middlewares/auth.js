const jwt = require('jsonwebtoken');

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
  // Récupérer le token depuis l'en-tête
  const token = req.header('x-auth-token');
  
  // Vérifier s'il n'y a pas de token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

module.exports = authMiddleware;
