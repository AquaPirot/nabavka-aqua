// pages/api/restaurant/orders.js
import { restaurantOnly } from '../../../middleware/auth';
import { query } from '../../../config/db';

export default restaurantOnly(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        // Kreiranje novog trebovanja
        const { items, notes } = req.body;
        
        // Validacija
        if (!items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'Trebovanje mora sadržati artikle' });
        }

        // Generisanje broja trebovanja
        const orderNumber = `TR-${Date.now()}-${req.user.code}`;
        
        // Kreiranje trebovanja
        const [orderResult] = await query(
          'INSERT INTO orders (order_number, restaurant_code, notes, status) VALUES (?, ?, ?, ?)',
          [orderNumber, req.user.code, notes || '', 'novo']
        );

        // Dodavanje stavki trebovanja
        for (const item of items) {
          await query(
            'INSERT INTO order_items (order_id, item_code, quantity) VALUES (?, ?, ?)',
            [orderResult.insertId, item.code, item.quantity]
          );
        }

        return res.status(201).json({ 
          message: 'Trebovanje uspešno kreirano',
          orderNumber 
        });

      case 'GET':
        // Pregled trebovanja za restoran
        const [orders] = await query(
          `SELECT o.*, 
           GROUP_CONCAT(JSON_OBJECT('code', oi.item_code, 'quantity', oi.quantity)) as items
           FROM orders o
           LEFT JOIN order_items oi ON o.id = oi.order_id
           WHERE o.restaurant_code = ?
           GROUP BY o.id
           ORDER BY o.created_at DESC`,
          [req.user.code]
        );

        return res.json(orders);

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
