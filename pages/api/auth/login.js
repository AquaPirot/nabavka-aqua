// pages/api/auth/login.js
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code, password, type } = req.body;

    // Proveravamo tip korisnika
    if (type === 'restaurant') {
      let restaurant;

      // Pronađi restoran po email-u ili kodu
      if (email) {
        restaurant = await prisma.restaurant.findUnique({
          where: { 
            email,
            active: true 
          }
        });
      } else if (code) {
        restaurant = await prisma.restaurant.findUnique({
          where: { 
            code,
            active: true 
          }
        });
      }

      if (!restaurant) {
        return res.status(401).json({ error: 'Pogrešni pristupni podaci' });
      }

      // Provera lozinke
      const isValid = await compare(password, restaurant.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Pogrešni pristupni podaci' });
      }

      // Generisanje tokena
      const token = sign(
        { 
          id: restaurant.id,
          type: 'restaurant',
          code: restaurant.code
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        token,
        user: {
          id: restaurant.id,
          name: restaurant.name,
          email: restaurant.email,
          code: restaurant.code
        }
      });
    }

    // Ovde možemo dodati admin login kasnije
    return res.status(400).json({ error: 'Nepodržan tip korisnika' });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Došlo je do greške prilikom prijave' });
  }
}
