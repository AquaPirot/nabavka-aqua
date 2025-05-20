// lib/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const TOKEN_EXPIRY = '24h';

/**
 * Verifikuje JWT token iz Authorization header-a
 */
export async function verifyToken(req) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return null;
    }

    // Robusno izdvajanje tokena
    const token = authHeader.includes(' ') ? authHeader.split(' ')[1] : authHeader;
    
    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

/**
 * Generiše JWT token za korisnika
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

/**
 * Middleware za zahtevanje admin prava
 */
export function adminOnly(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required' 
        });
      }
      
      if (user.type !== 'admin') {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Admin access required' 
        });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message
      });
    }
  };
}

/**
 * Middleware za zahtevanje restoran prava
 */
export function restaurantOnly(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required' 
        });
      }
      
      if (user.type !== 'restaurant') {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Restaurant access required' 
        });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Restaurant middleware error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  };
}

/**
 * Middleware za zahtevanje bilo kakve autentifikacije
 */
export function authRequired(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user) {
        return res.status(401).json({ 
          error: 'Unauthorized',
          message: 'Authentication required' 
        });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error.message 
      });
    }
  };
}
