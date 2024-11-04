// pages/api/admin/restaurants.js
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
        
        // Validacija
        if (!name || !code || !email || !password) {
          return res.status(400).json({ 
            error: 'Nedostaju obavezna polja (name, code, email, password)' 
          });
        }

        // Provera da li restoran već postoji
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

        // Kreiranje novog restorana
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

      case 'PUT':
        const { id: restaurantId, ...updateData } = req.body;
        
        if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const updated = await prisma.restaurant.update({
          where: { id: restaurantId },
          data: updateData
        });

        return res.json({
          message: 'Restoran uspešno ažuriran',
          restaurant: {
            id: updated.id,
            code: updated.code,
            name: updated.name,
            active: updated.active
          }
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Admin restaurants API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// pages/api/admin/orders.js
import prisma from '../../../lib/prisma'
import { adminOnly } from '../../../middleware/auth'

export default adminOnly(async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        const orders = await prisma.order.findMany({
          include: {
            restaurant: {
              select: {
                name: true,
                code: true
              }
            },
            items: {
              include: {
                item: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return res.json(orders);

      case 'PUT':
        const { id, status, notes } = req.body;

        if (!id || !status) {
          return res.status(400).json({ 
            error: 'ID i status su obavezni' 
          });
        }

        if (!['odobreno', 'odbijeno'].includes(status)) {
          return res.status(400).json({ 
            error: 'Status može biti samo odobreno ili odbijeno' 
          });
        }

        const updatedOrder = await prisma.order.update({
          where: { id },
          data: { 
            status,
            notes: notes ? `${notes} [Admin]` : null
          },
          include: {
            restaurant: {
              select: {
                name: true,
                code: true
              }
            },
            items: {
              include: {
                item: true
              }
            }
          }
        });

        return res.json(updatedOrder);

      default:
        res.setHeader('Allow', ['GET', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Admin orders API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
