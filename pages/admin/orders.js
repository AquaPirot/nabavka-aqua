import { useState, useEffect } from 'react';
import { LogOut, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';

export default function AdminOrders() {
  const [restaurants, setRestaurants] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('sve');
  const [selectedRestaurant, setSelectedRestaurant] = useState('sve');

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

    // Učitavanje svih trebovanja za sve restorane
    const allOrdersData = [];
    storedRestaurants.forEach(restaurant => {
      const restaurantOrders = JSON.parse(localStorage.getItem(`orders_${restaurant.code}`) || '[]');
      allOrdersData.push(...restaurantOrders.map(order => ({
        ...order,
        restaurantName: restaurant.name
      })));
    });
    setAllOrders(allOrdersData);
  }, []);

  const handleUpdateStatus = (order, newStatus) => {
    // Ažuriranje statusa trebovanja
    const updatedOrders = allOrders.map(o => 
      o.id === order.id ? { ...o, status: newStatus } : o
    );
    setAllOrders(updatedOrders);

    // Ažuriranje u localStorage
    const restaurantOrders = JSON.parse(localStorage.getItem(`orders_${order.restaurantCode}`) || '[]');
    const updatedRestaurantOrders = restaurantOrders.map(o =>
      o.id === order.id ? { ...o, status: newStatus } : o
    );
    localStorage.setItem(`orders_${order.restaurantCode}`, JSON.stringify(updatedRestaurantOrders));
  };

  const getFilteredOrders = () => {
    return allOrders.filter(order => {
      const matchesStatus = selectedStatus === 'sve' || order.status === selectedStatus;
      const matchesRestaurant = selectedRestaurant === 'sve' || order.restaurantCode === selectedRestaurant;
      return matchesStatus && matchesRestaurant;
    });
  };

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
              <h1 className="text-xl font-bold text-gray-800">Admin Panel - Trebovanja</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.location.href = '/admin/dashboard'}
                className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Nazad na dashboard
              </button>
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restoran
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sve">Svi restorani</option>
                {restaurants.map(restaurant => (
                  <option key={restaurant.code} value={restaurant.code}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="sve">Svi statusi</option>
                <option value="novo">Novo</option>
                <option value="odobreno">Odobreno</option>
                <option value="odbijeno">Odbijeno</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium text-gray-900">Lista trebovanja</h2>
          </div>

          {getFilteredOrders().length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nema pronađenih trebovanja
            </div>
          ) : (
            <div className="divide-y">
              {getFilteredOrders()
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">#{order.id}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-gray-500">Restoran: {order.restaurantName}</p>
                      <p className="text-sm text-gray-500">
                        Kreirano: {formatDate(order.createdAt)}
                      </p>
                    </div>
                    
                    {order.status === 'novo' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(order, 'odobreno')}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 flex items-center gap-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Odobri
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order, 'odbijeno')}
                          className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Odbij
                        </button>
                      </div>
                    )}
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
