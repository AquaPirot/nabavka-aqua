import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export default async function handler(req, res) {
  console.log('API hit:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  
  // CORS headers ostaju isti
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - lista restorana
  if (req.method === 'GET') {
    try {
      const restaurants = await prisma.restaurant.findMany();
      return res.status(200).json({
        restaurants,
        total: restaurants.length
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      return res.status(500).json({ error: 'Greška pri dohvatanju restorana' });
    }
  }

  // POST - kreiranje novog restorana
  if (req.method === 'POST') {
    try {
      const { name, code, email, password, address, phone } = req.body;
      
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
          address,
          phone,
          active: true
        }
      });

      // Ne vraćamo password u response
      const { password: _, ...restaurantData } = restaurant;
      
      return res.status(201).json(restaurantData);

    } catch (error) {
      console.error('Error creating restaurant:', error);
      return res.status(500).json({ error: 'Greška pri kreiranju restorana' });
    }
  }

  // Nepoznat HTTP metod
  return res.status(405).json({ error: 'Method not allowed' });
}
