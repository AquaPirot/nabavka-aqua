// pages/api/admin/restaurants.js
import { adminOnly } from '../../../middleware/auth';

// Zaštićena ruta koja je dostupna samo adminima
export default adminOnly(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // Vaša logika ovde...
        return res.status(200).json({ message: 'Admin protected route works!' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
