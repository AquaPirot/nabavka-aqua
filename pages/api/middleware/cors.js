// pages/api/middleware/cors.js
import Cors from 'cors'

const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  origin: [
    'https://nabavka-aqua.vercel.app',
    'http://localhost:3000'
  ]
})

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req, res, next) {
  await runMiddleware(req, res, cors)
  return next(req, res)
}
