// pages/api/admin/stats.js
import prisma from '../../../lib/prisma'
import { adminOnly } from '../../../middleware/auth'

export default adminOnly(async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const [restaurants, orders] = await Promise.all([
      prisma.restaurant.count(),
      prisma.order.findMany({
        select: {
          id: true,
          status: true
        }
      })
    ]);

    const activeOrders = orders.filter(o => o.status === 'novo').length;

    res.json({
      restaurants,
      activeOrders,
      totalOrders: orders.length
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
