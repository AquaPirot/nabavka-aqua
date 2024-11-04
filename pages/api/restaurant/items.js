// pages/api/restaurant/items.js
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../middleware/auth'

export default async function handler(req, res) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const items = await prisma.item.findMany({
          where: {
            active: true
          },
          orderBy: {
            name: 'asc'
          }
        });
        return res.json(items);

      case 'POST':
        if (user.type !== 'admin') {
          return res.status(403).json({ error: 'Samo admin može dodavati artikle' });
        }
        
        const { name, code } = req.body;
        if (!name || !code) {
          return res.status(400).json({ error: 'Naziv i šifra su obavezni' });
        }

        const newItem = await prisma.item.create({
          data: {
            name,
            code
          }
        });
        
        return res.status(201).json(newItem);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Items API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
