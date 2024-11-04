import prisma from '../../../lib/prisma'
import { adminOnly } from '../../../middleware/auth'
import bcrypt from 'bcryptjs'

export default adminOnly(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const restaurants = await prisma.restaurant.findMany({
          select: {
            id: true,
            code: true,
            name: true,
            email: true,
            address: true,
            phone: true,
            active: true,
            _count: {
              select: { orders: true }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        return res.json(restaurants);

      case 'POST':
        const { name, code, email, password, address, phone } = req.body;
        
        if (!name || !code || !email || !password) {
          return res.status(400).json({ 
            error: 'Nedostaju obavezna polja' 
          });
        }

        const exists = await prisma.restaurant.findFirst({
          where: {
            OR: [
              { email },
              { code }
            ]
          }
        });

        if (exists) {
          return res.status(400).json({ 
            error: 'Restoran sa ovim email-om ili kodom već postoji' 
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const restaurant = await prisma.restaurant.create({
          data: {
            name,
            code,
            email,
            password: hashedPassword,
            address,
            phone,
            active: true
          }
        });

        return res.status(201).json({
          id: restaurant.id,
          code: restaurant.code,
          name: restaurant.name
        });

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Admin restaurants API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
