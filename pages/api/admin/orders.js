import prisma from '@/lib/prisma'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await prisma.$connect()

    if (req.method === 'GET') {
      // Za dashboard
      if (req.query.dashboard === 'true') {
        const [total, newOrders] = await Promise.all([
          prisma.order.count(),
          prisma.order.count({
            where: { status: 'novo' }
          })
        ])
        
        return res.status(200).json({
          total,
          newOrders
        })
      }
      
      // Za listu porudžbina
      const orders = await prisma.order.findMany({
        include: {
          restaurant: true,
          items: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      return res.status(200).json(orders)
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('API Error:', error)
    return res.status(500).json({
      error: 'Greška na serveru',
      message: error.message
    })
  } finally {
    await prisma.$disconnect()
  }
}
