// pages/admin/restaurants/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Edit, Trash2, Plus, Check, X } from 'lucide-react'

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        console.log('Received restaurant data:', req.body);
        const { name, code, email, password, address, phone } = req.body;
        
        // Validation
        if (!name || !code || !email || !password) {
          console.log('Missing required fields');
          return res.status(400).json({ error: 'Nedostaju obavezna polja' });
        }

        // Check if exists
        const exists = await prisma.restaurant.findFirst({
          where: {
            OR: [
              { email },
              { code }
            ]
          }
        });

        if (exists) {
          console.log('Restaurant already exists');
          return res.status(400).json({ error: 'Restoran sa ovim email-om ili kodom već postoji' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create restaurant
        const restaurant = await prisma.restaurant.create({
          data: {
            name,
            code,
            email,
            password: hashedPassword,
            address,
            phone,
            active: true
          }
        });

        console.log('Restaurant created:', restaurant.id);

        return res.status(201).json({
          id: restaurant.id,
          code: restaurant.code,
          name: restaurant.name
        });

      // ... ostali case-ovi
    }
  } catch (error) {
    console.error('Restaurant creation error:', error);
    return res.status(500).json({ error: 'Došlo je do greške' });
  }
}

const fetchRestaurants = async () => {
  try {
    const token = localStorage.getItem('adminToken')
    const res = await fetch('/api/admin/restaurants', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    // Osigurajmo da je data niz
    setRestaurants(Array.isArray(data) ? data : [])
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  const toggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      const res = await fetch(`/api/admin/restaurants`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          active: !currentStatus
        })
      })
      
      if (!res.ok) throw new Error('Greška pri ažuriranju statusa')
      
      setRestaurants(restaurants.map(restaurant => 
        restaurant.id === id 
          ? { ...restaurant, active: !restaurant.active }
          : restaurant
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Učitavanje...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Upravljanje restoranima</h1>
          <button
            onClick={() => router.push('/admin/restaurants/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novi restoran
          </button>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Naziv
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kod
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trebovanja
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Akcije</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {restaurants.map((restaurant) => (
                      <tr key={restaurant.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{restaurant.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{restaurant.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            restaurant.active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {restaurant.active ? 'Aktivan' : 'Neaktivan'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {restaurant._count?.orders || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleStatus(restaurant.id, restaurant.active)}
                            className={`inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded 
                              ${restaurant.active 
                                ? 'text-red-700 bg-red-100 hover:bg-red-200' 
                                : 'text-green-700 bg-green-100 hover:bg-green-200'
                              } mr-2`}
                          >
                            {restaurant.active ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => router.push(`/admin/restaurants/${restaurant.id}`)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <Edit className="h-4 w-4" />
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
