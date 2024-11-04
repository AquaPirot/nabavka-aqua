// pages/api/middleware/cors.js
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: '*', // Za razvoj, kasnije specificirati tačne domene
  optionsSuccessStatus: 200
})

// Helper metoda za izvršavanje middleware-a
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors)
  res.status(200).json({ message: 'CORS enabled' })
}
