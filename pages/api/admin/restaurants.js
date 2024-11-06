export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Vraćamo test podatke bez pristupa bazi
  if (req.method === 'GET') {
    try {
      // Provera auth headera
      const token = req.headers.authorization?.replace('Bearer ', '')
      console.log('Received token:', token)

      if (!token) {
        return res.status(401).json({ error: 'No token provided' })
      }

      // Vraćamo mock podatke
      return res.status(200).json([
        {
          id: 1,
          name: "Test Restoran",
          code: "TEST1",
          email: "test@test.com",
          active: true,
          _count: { orders: 0 }
        }
      ])

    } catch (error) {
      console.error('API Error:', error)
      return res.status(500).json({
        error: 'Server error',
        message: error.message
      })
    }
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
