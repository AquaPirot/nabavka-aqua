// pages/_error.js
import { useRouter } from 'next/router'
import { ArrowLeft } from 'lucide-react'

function Error({ statusCode }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {statusCode ? statusCode : 'Greška'}
          </h1>
          <p className="text-xl text-gray-600">
            {statusCode
              ? `Došlo je do greške ${statusCode} na serveru`
              : 'Došlo je do greške u aplikaciji'}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Nazad
        </button>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
