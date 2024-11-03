import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function authMiddleware(req) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Molimo vas da se prijavite' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri autentifikaciji' },
      { status: 401 }
    );
  }
}

export async function adminMiddleware(req) {
  try {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Potrebna admin prava' },
        { status: 403 }
      );
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json(
        { error: 'Potrebna admin prava' },
        { status: 403 }
      );
    }

    req.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri autentifikaciji' },
      { status: 403 }
    );
  }
}
