import { useState, useEffect } from 'react';
import { LogOut, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function RestaurantDashboard() {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCode, setRestaurantCode] = useState('');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const code = localStorage.getItem('restaurantCode');
    const name = localStorage.getItem('restaurantName');
    
    if (!code || !name) {
      window.location.href = '/restaurant-login';
      return;
    }

    setRestaurantCode(code);
    setRestaurantName(name);

    // Učitavanje trebovanja
    const storedOrders = localStorage.getItem(`orders_${code}`);
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'novo':
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <Clock className="w-4 h-4" />
            Novo
          </span>
        );
      case 'odobreno':
        return (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Odobreno
          </span>
        );
      case 'odbijeno':
        return (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Odbijeno
          </span>
        );
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{restaurantName}</h1>
              <p className="text-sm text-gray-600">Dashboard</p>
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
            <h3 className="text-sm font-medium text-gray-500">Ukupno trebovanja</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{orders.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Nova trebovanja</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.filter(order => order.status === 'novo').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Odobrena trebovanja</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.filter(order => order.status === 'odobreno').length}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button
            onClick={() => window.location.href = '/restaurant/orders'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Novo trebovanje
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Trebovanja</h2>
          </div>

          {orders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Još uvek nema trebovanja
            </div>
          ) : (
            <div className="divide-y">
              {orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">#{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Kreirano: {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {item.quantity} {item.unit} - {item.name}
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-4 text-sm text-gray-500">
                      <p className="font-medium">Napomene:</p>
                      <p>{order.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
