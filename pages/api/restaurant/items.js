// pages/api/restaurant/items.js
import { restaurantOnly } from '../../../middleware/auth';

// Zaštićena ruta koja je dostupna samo restoranima
export default restaurantOnly(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        // req.user je dostupan ovde sa informacijama o autentifikovanom restoranu
        const restaurantCode = req.user.code;
        
        // Vaša logika ovde...
        return res.status(200).json({ message: 'Protected route works!' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
