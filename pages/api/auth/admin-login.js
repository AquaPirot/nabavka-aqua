// pages/api/auth/admin-login.js

export default async function handler(req, res) {
  // Basic CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Log the incoming request
    console.log('Primljen zahtev:', {
      method: req.method,
      body: req.body,
      headers: req.headers
    });

    // Return test data
    return res.status(200).json({
      token: 'test-token-123',
      user: {
        id: 1,
        email: 'admin@trebovanje.rs',
        name: 'Test Admin'
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
}
