// pages/api/restaurant/stats.js
import { prisma } from '../../../lib/prisma'
import { withRestaurantAuth } from '../middleware/auth'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const restaurantCode = req.user.code

    // Get orders statistics
    const [orderCount, ordersByStatus] = await Promise.all([
      prisma.order.count({
        where: { restaurantCode }
      }),
      prisma.order.groupBy({
        where: { restaurantCode },
        by: ['status'],
        _count: {
          _all: true
        }
      })
    ])

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      where: { restaurantCode },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    })

    // Get most ordered items
    const mostOrderedItems = await prisma.orderItem.groupBy({
      by: ['itemCode'],
      where: {
        order: {
          restaurantCode
        }
      },
      _count: {
        _all: true
      },
      _sum: {
        quantity: true
      }
    })

    res.json({
      overview: {
        totalOrders: orderCount
      },
      ordersByStatus: ordersByStatus.reduce((acc, curr) => {
        acc[curr.status] = curr._count._all
        return acc
      }, {}),
      recentOrders,
      mostOrderedItems: await Promise.all(
        mostOrderedItems.map(async (item) => {
          const itemDetails = await prisma.item.findUnique({
            where: { code: item.itemCode }
          })
          return {
            ...itemDetails,
            orderCount: item._count._all,
            totalQuantity: item._sum.quantity
          }
        })
      )
    })
  } catch (error) {
    console.error('Restaurant stats API error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default withRestaurantAuth(handler)
