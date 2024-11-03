// middleware/auth.js
import jwt from 'jsonwebtoken';

// Helper funkcija za verifikaciju tokena
export async function verifyToken(req) {
  try {
    // Uzimamo token iz Authorization header-a
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    // Verifikujemo token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// Middleware za admin rute
export function adminOnly(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user || user.type !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized - Admin access required' });
      }

      return handler(req, res);
    } catch (error) {
      console.error('Admin middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Middleware za restoranske rute
export function restaurantOnly(handler) {
  return async (req, res) => {
    try {
      const user = await verifyToken(req);
      
      if (!user || user.type !== 'restaurant') {
        return res.status(401).json({ error: 'Unauthorized - Restaurant access required' });
      }

      // Dodajemo user informacije u req objekat
      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Restaurant middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
