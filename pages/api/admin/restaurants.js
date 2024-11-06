// pages/api/admin/restaurants.js
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    await prisma.$connect()

    // GET metoda - različiti odgovori za dashboard i listu
    if (req.method === 'GET') {
      // Za dashboard
      if (req.query.dashboard === 'true') {
        const total = await prisma.restaurant.count()
        return res.status(200).json({ total })
      }
      
      // Za listu restorana
      const restaurants = await prisma.restaurant.findMany({
        select: {
          id: true,
          name: true,
          code: true,
          email: true,
          active: true,
          _count: {
            select: { orders: true }
          }
        }
      })
      return res.status(200).json(restaurants)
    }

    // Ostale metode ostaju iste...
    if (req.method === 'POST') {
      const { name, code, email, password, address, phone } = req.body
      
      const existing = await prisma.restaurant.findFirst({
        where: { OR: [{ email }, { code }] }
      })
      
      if (existing) {
        return res.status(400).json({
          error: 'Restoran sa ovim email-om ili kodom već postoji'
        })
      }

      const hashedPassword = await hash(password, 10)
      const restaurant = await prisma.restaurant.create({
        data: {
          name,
          code,
          email,
          password: hashedPassword,
          address: address || '',
          phone: phone || '',
          active: true
        }
      })

      const { password: _, ...restaurantData } = restaurant
      return res.status(201).json(restaurantData)
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
