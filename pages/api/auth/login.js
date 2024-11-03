// pages/api/auth/login.js
import { query } from '../../../config/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code, password, isAdmin } = req.body;

    if (isAdmin) {
      // Admin login logika
      if (code === 'admin' && password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({
          success: true,
          type: 'admin',
          token: 'admin-token' // Kasnije ćemo implementirati pravi JWT
        });
      }
    } else {
      // Restaurant login logika
      const [restaurant] = await query(
        'SELECT * FROM restaurants WHERE code = ? AND password = ? AND active = 1',
        [code, password]
      );

      if (restaurant) {
        return res.status(200).json({
          success: true,
          type: 'restaurant',
          restaurant: {
            code: restaurant.code,
            name: restaurant.name
          }
        });
      }
    }

    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
