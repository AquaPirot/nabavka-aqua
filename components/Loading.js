// components/Loading.js
export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
}
