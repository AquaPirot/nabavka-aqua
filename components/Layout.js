// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <main>{children}</main>
    </div>
  )
}

// components/LoadingSpinner.js
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )
}

// components/ErrorMessage.js
export default function ErrorMessage({ message }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  )
}

// components/SuccessMessage.js
export default function SuccessMessage({ message }) {
  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <span className="block sm:inline">{message}</span>
    </div>
  )
}
