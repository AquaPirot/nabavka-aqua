// pages/api/restaurant/orders.js
import prisma from '../../../lib/prisma'
import { verifyToken } from '../../../middleware/auth'

export default async function handler(req, res) {
  try {
    const user = await verifyToken(req);
    if (!user || user.type !== 'restaurant') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    switch (req.method) {
      case 'GET':
        const orders = await prisma.order.findMany({
          where: {
            restaurantCode: user.code
          },
          include: {
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

      case 'POST':
        const { items, notes } = req.body;
        
        if (!items?.length) {
          return res.status(400).json({ error: 'Trebovanje mora sadržati artikle' });
        }

        const orderNumber = `TR-${Date.now()}-${user.code}`;

        const order = await prisma.order.create({
          data: {
            orderNumber,
            restaurantCode: user.code,
            notes,
            items: {
              create: items.map(item => ({
                quantity: item.quantity,
                item: {
                  connect: { code: item.code }
                }
              }))
            }
          },
          include: {
            items: {
              include: {
                item: true
              }
            }
          }
        });

        return res.status(201).json(order);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ error: `Method ${req.method} nije dozvoljen` });
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
