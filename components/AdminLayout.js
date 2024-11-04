// components/AdminLayout.js
import { LogOut, Home, Package, Users } from 'lucide-react'
import { useRouter } from 'next/router'

export default function AdminLayout({ children }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    router.push('/admin-login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
          </div>
          <nav className="flex-1 p-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => router.push('/admin/restaurants')}
              className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Users className="h-5 w-5 mr-2" />
              Restorani
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Package className="h-5 w-5 mr-2" />
              Trebovanja
            </button>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Odjavi se
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

// components/RestaurantLayout.js
import { LogOut, Home, Package, List } from 'lucide-react'
import { useRouter } from 'next/router'

export default function RestaurantLayout({ children }) {
  const router = useRouter()
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/restaurant-login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h2 className="text-xl font-bold text-gray-800">Restoran Panel</h2>
          </div>
          <nav className="flex-1 p-4">
            <button
              onClick={() => router.push('/restaurant/dashboard')}
              className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Home className="h-5 w-5 mr-2" />
              Dashboard
            </button>
            <button
              onClick={() => router.push('/restaurant/orders')}
              className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <List className="h-5 w-5 mr-2" />
              Trebovanja
            </button>
            <button
              onClick={() => router.push('/restaurant/orders/new')}
              className="flex items-center w-full px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100 rounded"
            >
              <Package className="h-5 w-5 mr-2" />
              Novo trebovanje
            </button>
          </nav>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Odjavi se
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
