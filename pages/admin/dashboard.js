import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    restaurants: 0,
    newOrders: 0,
    totalOrders: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Get restaurants count
        const resRestaurants = await fetch('/api/admin/restaurants', { headers });
        const restaurantsData = await resRestaurants.json();
        
        if (!resRestaurants.ok) {
          throw new Error(restaurantsData.error || 'Greška pri učitavanju restorana');
        }
        
        // Get orders count
        const resOrders = await fetch('/api/admin/orders', { headers });
        const ordersData = await resOrders.json();
        
        if (!resOrders.ok) {
          throw new Error(ordersData.error || 'Greška pri učitavanju porudžbina');
        }

        setStats({
          restaurants: restaurantsData.total || 0,
          newOrders: ordersData.newOrders || 0,
          totalOrders: ordersData.total || 0
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError(error.message);
        if (error.message.includes('token') || error.message.includes('Unauthorized')) {
          router.push('/admin/login');
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg mb-2">Ukupno restorana</h2>
          <p className="text-3xl font-bold">{stats.restaurants}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg mb-2">Nova trebovanja</h2>
          <p className="text-3xl font-bold">{stats.newOrders}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg mb-2">Ukupno trebovanja</h2>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg mb-2">Upravljanje restoranima</h2>
          <button 
            onClick={() => router.push('/admin/restaurants')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pregledaj
          </button>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg mb-2">Upravljanje trebovanjima</h2>
          <button 
            onClick={() => router.push('/admin/orders')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Pregledaj
          </button>
        </div>
      </div>
    </div>
  );
}
