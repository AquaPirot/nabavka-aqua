// pages/admin/dashboard.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { BarChart, Package, Users } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    restaurants: 0,
    activeOrders: 0,
    totalOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin-login')
      return
    }

    fetchDashboardData(token)
  }, [])

  const fetchDashboardData = async (token) => {
    try {
      const [restaurantsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/restaurants', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('/api/admin/orders', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ])

      const [restaurants, orders] = await Promise.all([
        restaurantsRes.json(),
        ordersRes.json()
      ])

      setStats({
        restaurants: restaurants.length,
        activeOrders: orders.filter(o => o.status === 'novo').length,
        totalOrders: orders.length
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className="h-6 w-6 text-gray-400" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Učitavanje...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-6">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Admin Dashboard
            </h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard 
                  title="Ukupno restorana" 
                  value={stats.restaurants}
                  icon={Users}
                />
                <StatCard 
                  title="Nova trebovanja" 
                  value={stats.activeOrders}
                  icon={Package}
                />
                <StatCard 
                  title="Ukupno trebovanja" 
                  value={stats.totalOrders}
                  icon={BarChart}
                />
              </div>

              <div className="mt-8">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Upravljanje restoranima
                        </h3>
                        <button
                          onClick={() => router.push('/admin/restaurants')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Pregledaj
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          Upravljanje trebovanjima
                        </h3>
                        <button
                          onClick={() => router.push('/admin/orders')}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          Pregledaj
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
