// pages/api/middleware/logging.js
export default function withLogging(handler) {
  return async (req, res) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body) console.log('Body:', req.body);
    
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }
}
