// pages/api/admin/restaurants.js
import { query } from '../../../config/db';

export default async function handler(req, res) {
  // Kasnije ćemo dodati proveru admin autentifikacije
  
  switch (req.method) {
    case 'GET':
      try {
        const restaurants = await query('SELECT * FROM restaurants');
        return res.status(200).json(restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    case 'POST':
      try {
        const { code, name, address, contact, email, phone, password } = req.body;
        
        const result = await query(
          `INSERT INTO restaurants (code, name, address, contact, email, phone, password) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [code, name, address, contact, email, phone, password]
        );
        
        return res.status(201).json({
          success: true,
          id: result.insertId
        });
      } catch (error) {
        console.error('Error creating restaurant:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

// pages/api/admin/orders.js
import { query } from '../../../config/db';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const orders = await query(`
          SELECT o.*, r.name as restaurant_name 
          FROM orders o 
          JOIN restaurants r ON o.restaurant_code = r.code
          ORDER BY o.created_at DESC
        `);
        
        return res.status(200).json(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    case 'PUT':
      try {
        const { orderId, status } = req.body;
        
        await query(
          'UPDATE orders SET status = ? WHERE id = ?',
          [status, orderId]
        );
        
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error('Error updating order:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}
