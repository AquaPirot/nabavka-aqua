// pages/api/restaurant/items.js
import { query } from '../../../config/db';
import { verifyToken } from '../../../middleware/auth';

export default async function handler(req, res) {
  try {
    // Verifikacija tokena
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const items = await query(
          'SELECT * FROM items WHERE active = true ORDER BY name'
        );
        return res.json(items);

      case 'POST':
        if (user.type !== 'admin') {
          return res.status(403).json({ error: 'Samo admin može dodavati artikle' });
        }
        
        const { name, code } = req.body;
        if (!name || !code) {
          return res.status(400).json({ error: 'Naziv i šifra su obavezni' });
        }

        const result = await query(
          'INSERT INTO items (name, code) VALUES (?, ?)',
          [name, code]
        );
        
        return res.status(201).json({
          id: result.insertId,
          name,
          code
        });

      case 'PUT':
        if (user.type !== 'admin') {
          return res.status(403).json({ error: 'Samo admin može menjati artikle' });
        }

        const { id, ...updateData } = req.body;
        
        await query(
          'UPDATE items SET ? WHERE id = ?',
          [updateData, id]
        );
        
        return res.json({ message: 'Artikal uspešno ažuriran' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Items API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
