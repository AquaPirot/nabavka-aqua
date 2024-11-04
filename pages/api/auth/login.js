// pages/api/auth/login.js
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, type } = req.body;

    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Sva polja su obavezna' });
    }

    let user;
    if (type === 'restaurant') {
      user = await prisma.restaurant.findUnique({
        where: { 
          email,
          active: true 
        }
      });
    }
    // Admin login logiku ćemo dodati kasnije

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Pogrešni pristupni podaci' });
    }

    const token = jwt.sign(
      { 
        id: user.id,
        type,
        code: type === 'restaurant' ? user.code : null
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        code: user.code
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom prijave' });
  }
}
