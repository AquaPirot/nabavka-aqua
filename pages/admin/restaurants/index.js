// pages/admin/restaurants/index.js
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Edit, Trash2, Plus, Check, X } from 'lucide-react'

export default function RestaurantsManagement() {
  const router = useRouter()
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    fetchRestaurants()
  }, [])

  const fetchRestaurants = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      console.log('Fetching with token:', token) // Debug log
      
      const res = await fetch('/api/admin/restaurants', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Response status:', res.status) // Debug log
      const data = await res.json()
      console.log('Fetched data:', data) // Debug log
      
      if (!res.ok) throw new Error(data.error)
      setRestaurants(data)
    } catch (err) {
      console.error('Fetch error:', err) // Debug log
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

  // Ostatak koda ostaje isti...
  return (
    // Vaš postojeći JSX...
  )
}
