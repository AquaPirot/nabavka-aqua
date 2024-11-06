// utils/db-test.ts
import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

export async function testDatabaseConnection() {
  const prisma = new PrismaClient()
  
  try {
    // Pokušaj jednostavan upit
    await prisma.$queryRaw`SELECT 1`
    console.log('✅ Database connection successful')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

// Middleware za proveru konekcije
export async function withDatabase(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const isConnected = await testDatabaseConnection()
      
      if (!isConnected) {
        return res.status(500).json({
          error: 'Database connection failed',
          message: 'Could not connect to database'
        })
      }
      
      return handler(req, res)
    } catch (error) {
      console.error('Database middleware error:', error)
      return res.status(500).json({ 
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      })
    }
  }
}
