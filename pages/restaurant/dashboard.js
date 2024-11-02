import { useState, useEffect } from 'react';
import { Minus, Plus, LogOut } from 'lucide-react';

function RestaurantDashboard() {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCode, setRestaurantCode] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Provera autentifikacije
    const code = localStorage.getItem('restaurantCode');
    const name = localStorage.getItem('restaurantName');
    
    if (!code || !name) {
      window.location.href = '/restaurant-login';
      return;
    }

    setRestaurantCode(code);
    setRestaurantName(name);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{restaurantName}</h1>
              <p className="text-sm text-gray-600">Kod: {restaurantCode}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('restaurantCode');
                localStorage.removeItem('restaurantName');
                window.location.href = '/restaurant-login';
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
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Današnje porudžbine</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Aktivne porudžbine</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">0</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Ukupan promet</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">0 RSD</p>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Aktivne porudžbine</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Trenutno nema aktivnih porudžbina
            </div>
          ) : (
            <div className="divide-y">
              {orders.map((order) => (
                <div key={order.id} className="p-6">
                  {/* Order details will go here */}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Brze akcije</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              className="p-4 bg-blue-50 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
              onClick={() => {/* TODO: Implement */}}
            >
              Pregled svih porudžbina
            </button>
            <button
              className="p-4 bg-purple-50 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors"
              onClick={() => {/* TODO: Implement */}}
            >
              Upravljanje artiklima
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDashboard;
