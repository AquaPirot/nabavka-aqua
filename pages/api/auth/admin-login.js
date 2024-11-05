// pages/api/auth/admin-login.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  // Basic headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Request received:', req.body);
    const { email, password } = req.body;

    // Prvo samo proveravamo da li korisnik postoji
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    console.log('Admin found:', !!admin);

    // Za testiranje, vraćamo success bez provere lozinke
    return res.status(200).json({
      token: 'test-token',
      user: {
        id: admin?.id || 1,
        email: admin?.email || email,
        name: admin?.name || 'Test Admin'
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
