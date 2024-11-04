// pages/api/auth/admin-login.js
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Sva polja su obavezna' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin || !await bcrypt.compare(password, admin.password)) {
      return res.status(401).json({ error: 'Pogrešni pristupni podaci' });
    }

    const token = jwt.sign(
      { 
        id: admin.id,
        type: 'admin',
        email: admin.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Došlo je do greške prilikom prijave' });
  }
}
