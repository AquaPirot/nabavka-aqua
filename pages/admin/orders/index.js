// pages/admin/orders/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Check, X, Eye } from 'lucide-react'

export default function OrdersManagement() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    // Osigurajmo da je data niz
    setOrders(Array.isArray(data) ? data : [])
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })
      
      if (!res.ok) throw new Error('Greška pri ažuriranju statusa')
      
      await fetchOrders() // Refresh orders after update
    } catch (err) {
      setError(err.message)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('sr-RS', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Učitavanje...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Upravljanje trebovanjima</h1>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broj trebovanja
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Restoran
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Datum
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Broj stavki
                      </th>
                      <th className="relative px-6 py-3">
                        <span className="sr-only">Akcije</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.orderNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.restaurant.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.restaurant.code}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === 'novo' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'odobreno' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.items.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {order.status === 'novo' && (
                            <>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'odobreno')}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 mr-2"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => updateOrderStatus(order.id, 'odbijeno')}
                                className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 mr-2"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-600 text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
