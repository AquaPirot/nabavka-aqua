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
