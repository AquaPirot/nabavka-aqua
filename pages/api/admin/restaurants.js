import { query } from '../../../config/db';

export default async function handler(req, res) {
  // Kasnije ćemo dodati proveru admin autentifikacije
  
  switch (req.method) {
    case 'GET':
      try {
        const restaurants = await query('SELECT * FROM restaurants WHERE active = true');
        return res.status(200).json(restaurants);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    case 'POST':
      try {
        const { name, code, email, password, address, phone } = req.body;
        
        if (!name || !code || !email || !password) {
          return res.status(400).json({ 
            error: 'Missing required fields' 
          });
        }
        
        const result = await query(
          'INSERT INTO restaurants (name, code, email, password, address, phone) VALUES (?, ?, ?, ?, ?, ?)',
          [name, code, email, password, address, phone]
        );
        
        return res.status(201).json({ 
          message: 'Restaurant created successfully',
          id: result.insertId 
        });
      } catch (error) {
        console.error('Error creating restaurant:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}
