// pages/api/middleware/auth.js
import { prisma } from '../../../lib/prisma'
import jwt from 'jsonwebtoken'

export async function verifyToken(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (!token) return null

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

export function withAuth(handler) {
  return async (req, res) => {
    const user = await verifyToken(req)
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    req.user = user
    return handler(req, res)
  }
}

export function withAdminAuth(handler) {
  return async (req, res) => {
    const user = await verifyToken(req)
    if (!user || user.type !== 'admin') {
      return res.status(401).json({ error: 'Admin access required' })
    }
    req.user = user
    return handler(req, res)
  }
}

export function withRestaurantAuth(handler) {
  return async (req, res) => {
    const user = await verifyToken(req)
    if (!user || user.type !== 'restaurant') {
      return res.status(401).json({ error: 'Restaurant access required' })
    }
    req.user = user
    return handler(req, res)
  }
}
