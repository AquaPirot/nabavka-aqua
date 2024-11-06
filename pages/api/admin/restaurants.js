import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  // Prvo pokušavamo da se povežemo sa bazom
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ error: 'Greška pri povezivanju sa bazom' });
  }

  console.log('API hit:', {
    method: req.method,
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
    // GET - lista restorana
    if (req.method === 'GET') {
      const restaurants = await prisma.restaurant.findMany();
      console.log('Found restaurants:', restaurants.length);
      return res.status(200).json({
        restaurants,
        total: restaurants.length
      });
    }

    // POST - kreiranje novog restorana
    if (req.method === 'POST') {
      const { name, code, email, password, address, phone } = req.body;
      
      console.log('Creating new restaurant:', { name, code, email, address, phone });
      
      // Provera da li restoran već postoji
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

      // Hash password-a
      const hashedPassword = await hash(password, 10);

      // Kreiranje restorana
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

      console.log('Restaurant created successfully:', restaurant.id);

      // Ne vraćamo password u response
      const { password: _, ...restaurantData } = restaurant;
      
      return res.status(201).json(restaurantData);
    }

    // Nepoznat HTTP metod
    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Greška na serveru',
      details: error.message 
    });
  } finally {
    // Uvek zatvaramo konekciju
    await prisma.$disconnect();
    console.log('Database disconnected');
  }
}
