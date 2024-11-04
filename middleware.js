// middleware.js
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request) {
  // Putanje koje ne zahtevaju autentifikaciju
  const publicPaths = [
    '/',
    '/admin-login',
    '/restaurant-login',
    '/api/auth/admin-login',
    '/api/auth/restaurant-login'
  ]

  const path = request.nextUrl.pathname

  // Dozvoli pristup public rutama
  if (publicPaths.some(publicPath => path.startsWith(publicPath))) {
    return NextResponse.next()
  }

  // Proveri postojanje tokena u kolačićima
  const token = request.cookies.get('token')?.value

  // Ako nema tokena, redirect na odgovarajući login
  if (!token) {
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    if (path.startsWith('/restaurant')) {
      return NextResponse.redirect(new URL('/restaurant-login', request.url))
    }
  }

  try {
    // Verifikacija tokena ako postoji
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Provera tipa korisnika i pristupa
      if (path.startsWith('/admin') && decoded.type !== 'admin') {
        return NextResponse.redirect(new URL('/admin-login', request.url))
      }

      if (path.startsWith('/restaurant') && decoded.type !== 'restaurant') {
        return NextResponse.redirect(new URL('/restaurant-login', request.url))
      }
    }

    // Nastavi sa zahtevom ako je sve u redu
    return NextResponse.next()
  } catch (error) {
    // U slučaju nevalidnog tokena, redirect na odgovarajući login
    if (path.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.redirect(new URL('/restaurant-login', request.url))
  }
}

// Konfiguracija putanja za koje se primenjuje middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication endpoints)
     * 2. /_next/* (Next.js internals)
     * 3. /favicon.ico, /site.webmanifest (static files)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
