import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  try {
    console.log('Attempting database connection...');
    
    // Test database connection
    try {
      await prisma.$connect();
      console.log('Database connected successfully');
    } catch (dbError) {
      console.error('Database connection error details:', {
        message: dbError.message,
        code: dbError.code,
        meta: dbError.meta
      });
      return res.status(500).json({ 
        error: 'Greška pri povezivanju sa bazom',
        details: dbError.message,
        code: dbError.code
      });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Logging request details
    console.log('Request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
    });

    // GET request
    if (req.method === 'GET') {
      const restaurants = await prisma.restaurant.findMany();
      return res.status(200).json({
        restaurants,
        total: restaurants.length
      });
    }

    // POST request
    if (req.method === 'POST') {
      const { name, code, email, password, address, phone } = req.body;

      const existing = await prisma.restaurant.findFirst({
        where: {
          OR: [
            { email },
            { code }
          ]
        }
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
      return res.status(201).json(restaurantData);
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    
    return res.status(500).json({ 
      error: 'Greška na serveru',
      details: error.message,
      code: error.code
    });
  } finally {
    await prisma.$disconnect();
  }
}
