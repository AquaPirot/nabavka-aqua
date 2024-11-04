import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API pozvan sa telom:', req.body); // Debugging

  try {
    const { email, password } = req.body;
    
    console.log('Provera kredencijala za:', email); // Debugging

    if (!email || !password) {
      return res.status(400).json({ error: 'Sva polja su obavezna' });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    console.log('Admin pronađen:', !!admin); // Debugging

    if (!admin) {
      return res.status(401).json({ error: 'Pogrešni pristupni podaci' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    console.log('Password validan:', isValid); // Debugging

    if (!isValid) {
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

    console.log('Token generisan'); // Debugging

    return res.status(200).json({ 
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      error: 'Došlo je do greške prilikom prijave',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
