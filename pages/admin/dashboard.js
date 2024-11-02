import React, { useState, useEffect } from 'react';
import { LogOut, Users, ClipboardList, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState([]);
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    // Provera admin autentifikacije
    const isAdmin = localStorage.getItem('isAdmin');
    if (!isAdmin) {
      window.location.href = '/admin-login';
      return;
    }

    // Učitavanje restorana
    const storedRestaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    setRestaurants(storedRestaurants);

    // Učitavanje svih trebovanja
    const allOrdersData = [];
    storedRestaurants.forEach(restaurant => {
      const restaurantOrders = JSON.parse(localStorage.getItem(`orders_${restaurant.code}`) || '[]');
      allOrdersData.push(...restaurantOrders);
    });
    setAllOrders(allOrdersData);
  }, []);

  const getNewOrdersCount = () => {
    return allOrders.filter(order => order.status === 'novo').length;
  };

  const getActiveRestaurantsCount = () => {
    return restaurants.filter(r => r.active).length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('isAdmin');
                window.location.href = '/admin-login';
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut className="h-5 w-5" />
              Odjavi se
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Restorani</p>
                <p className="text-2xl font-bold">{getActiveRestaurantsCount()}</p>
                <p className="text-xs text-gray-500">Aktivnih: {getActiveRestaurantsCount()} / Ukupno: {restaurants.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Ukupno trebovanja</p>
                <p className="text-2xl font-bold">{allOrders.length}</p>
                <p className="text-xs text-gray-500">
                  Danas: {allOrders.filter(order => 
                    new Date(order.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-500">Nova trebovanja</p>
                <p className="text-2xl font-bold">{getNewOrdersCount()}</p>
                <p className="text-xs text-gray-500">Čekaju na odobrenje</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            onClick={() => window.location.href = '/admin/orders'}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              Upravljanje trebovanjima
            </h3>
            <p className="text-sm text-gray-600">
              Pregledajte i upravljajte svim trebovanjima. {getNewOrdersCount()} {getNewOrdersCount() === 1 ? 'novo trebovanje čeka' : 'novih trebovanja čeka'} na odobrenje.
            </p>
          </div>

          <div 
            onClick={() => window.location.href = '/admin/restaurants'}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Upravljanje restoranima
            </h3>
            <p className="text-sm text-gray-600">
              Dodajte nove restorane ili upravljajte postojećim. Trenutno imate {restaurants.length} {restaurants.length === 1 ? 'registrovan restoran' : 'registrovanih restorana'}.
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Nedavna aktivnost</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {allOrders
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map(order => {
                  const restaurant = restaurants.find(r => r.code === order.restaurantCode);
                  return (
                    <div key={order.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{restaurant?.name || 'Nepoznat restoran'}</p>
                        <p className="text-sm text-gray-500">
                          Trebovanje #{order.id} - {order.status}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('sr-RS', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
