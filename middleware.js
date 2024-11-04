// middleware.js
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function middleware(request) {
  // Putanje koje ne zahtevaju autentifikaciju
  const publicPaths = [
    '/admin-login',
    '/restaurant-login',
    '/api/auth/admin-login',
    '/api/auth/restaurant-login'
  ]

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  // Ako nema tokena, redirect na login
  if (!token) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    if (request.nextUrl.pathname.startsWith('/restaurant')) {
      return NextResponse.redirect(new URL('/restaurant-login', request.url))
    }
    return NextResponse.next()
  }

  try {
    // Verifikacija tokena
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    )

    // Provera tipa korisnika i pristupa
    if (request.nextUrl.pathname.startsWith('/admin') && payload.type !== 'admin') {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }

    if (request.nextUrl.pathname.startsWith('/restaurant') && payload.type !== 'restaurant') {
      return NextResponse.redirect(new URL('/restaurant-login', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // Ako je token nevažeći, redirect na login
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.redirect(new URL('/restaurant-login', request.url))
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/restaurant/:path*',
    '/api/:path*'
  ]
}
