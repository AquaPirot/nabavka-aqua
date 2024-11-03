// pages/api/middleware/auth.js

import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function authMiddleware(req) {
  try {
    const token = await getToken({ req });
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login' },
        { status: 401 }
      );
    }

    req.user = token;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 401 }
    );
  }
}

export async function adminMiddleware(req) {
  try {
    const token = await getToken({ req });
    
    if (!token || token.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      );
    }

    req.user = token;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 403 }
    );
  }
}
