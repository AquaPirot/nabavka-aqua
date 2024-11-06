import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  console.log('API Request:', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });

  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test DB connection
    await prisma.$connect();

    if (req.method === 'GET') {
      const restaurants = await prisma.restaurant.findMany();
      console.log(`Found ${restaurants.length} restaurants`);
      return res.status(200).json({ restaurants });
    }

    if (req.method === 'POST') {
      const { name, code, email, password, address, phone } = req.body;
      console.log('Creating restaurant:', { name, code, email });

      // Check if exists
      const existing = await prisma.restaurant.findFirst({
        where: { OR: [{ email }, { code }] }
      });

      if (existing) {
        return res.status(400).json({
          error: 'Restoran sa ovim email-om ili kodom već postoji'
        });
      }

      const hashedPassword = await hash(password, 10);
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
      });

      const { password: _, ...restaurantData } = restaurant;
      console.log('Restaurant created:', restaurantData.id);
      
      return res.status(201).json(restaurantData);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Greška na serveru',
      message: error.message
    });
  } finally {
    await prisma.$disconnect();
  }
}
