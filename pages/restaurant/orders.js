import { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart, LogOut, X } from 'lucide-react';

function RestaurantOrders() {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCode, setRestaurantCode] = useState('');
  const [items, setItems] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [notes, setNotes] = useState('');
  
  useEffect(() => {
    const code = localStorage.getItem('restaurantCode');
    const name = localStorage.getItem('restaurantName');
    
    if (!code || !name) {
      window.location.href = '/restaurant-login';
      return;
    }

    setRestaurantCode(code);
    setRestaurantName(name);

    // Učitavanje artikala
    const storedItems = localStorage.getItem(`items_${code}`);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const addItem = (item) => {
    setOrderItems(prev => ({
      ...prev,
      [item.id]: parseFloat((prev[item.id] || 0) + 1).toFixed(2)
    }));
  };

  const removeItem = (item) => {
    setOrderItems(prev => {
      const newOrder = { ...prev };
      const currentValue = parseFloat(newOrder[item.id]);
      if (currentValue > 1) {
        newOrder[item.id] = (currentValue - 1).toFixed(2);
      } else {
        delete newOrder[item.id];
      }
      return newOrder;
    });
  };

  const updateItemQuantity = (item, value) => {
    const quantity = parseFloat(parseFloat(value).toFixed(2));
    
    if (quantity > 0) {
      setOrderItems(prev => ({
        ...prev,
        [item.id]: quantity
      }));
    } else {
      setOrderItems(prev => {
        const newOrder = { ...prev };
        delete newOrder[item.id];
        return newOrder;
      });
    }
  };

  const getItemsByCategory = () => {
    const categorized = {};
    items.forEach(item => {
      if (item.available) {
        if (!categorized[item.category]) {
          categorized[item.category] = [];
        }
        categorized[item.category].push(item);
      }
    });
    return categorized;
  };

  const handleCreateOrder = () => {
    if (Object.keys(orderItems).length === 0) {
      alert('Niste uneli količine za trebovanje');
      return;
    }

    const orderedItems = Object.entries(orderItems).map(([itemId, quantity]) => {
      const item = items.find(i => i.id === parseInt(itemId));
      return {
        itemId: parseInt(itemId),
        name: item.name,
        quantity: parseFloat(quantity),
        unit: item.unit
      };
    });

    const order = {
      id: `TRB${Date.now()}`,
      restaurantCode,
      items: orderedItems,
      notes,
      status: 'novo',
      createdAt: new Date().toISOString()
    };

    // Čuvamo trebovanje
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${restaurantCode}`) || '[]');
    localStorage.setItem(
      `orders_${restaurantCode}`, 
      JSON.stringify([...existingOrders, order])
    );

    setOrderItems({});
    setNotes('');
    setShowOrderForm(false);
    alert('Trebovanje je uspešno kreirano!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{restaurantName}</h1>
              <p className="text-sm text-gray-600">Novo trebovanje</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowOrderForm(true)}
                className="relative flex items-center gap-2 text-blue-600 hover:text-blue-800"
              >
                <ShoppingCart className="h-6 w-6" />
                {Object.keys(orderItems).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {Object.values(orderItems).reduce((a, b) => parseFloat(a) + parseFloat(b), 0).toFixed(0)}
                  </span>
                )}
                Pregled trebovanja
              </button>
              <button
                onClick={() => window.location.href = '/restaurant/dashboard'}
                className="text-blue-600 hover:text-blue-800"
              >
                Nazad na dashboard
              </button>
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Items by Category */}
        {Object.entries(getItemsByCategory()).map(([category, categoryItems]) => (
          <div key={category} className="mb-8">
            <h2 className="text-xl font-bold mb-4">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">Jedinica: {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {orderItems[item.id] && (
                      <>
                        <button
                          onClick={() => removeItem(item)}
                          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          value={orderItems[item.id] || ''}
                          onChange={(e) => updateItemQuantity(item, e.target.value)}
                          className="w-16 text-center border rounded p-1"
                        />
                      </>
                    )}
                    <button
                      onClick={() => addItem(item)}
                      className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trebovanje Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pregled trebovanja</h2>
              <button
                onClick={() => setShowOrderForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {Object.keys(orderItems).length === 0 ? (
              <p className="text-center text-gray-500 my-4">Niste uneli količine za trebovanje</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(orderItems).map(([itemId, quantity]) => {
                  const item = items.find(i => i.id === parseInt(itemId));
                  if (!item) return null;
                  return (
                    <div key={itemId} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Količina: {parseFloat(quantity).toFixed(2)} {item.unit}
                        </p>
                      </div>
                    </div>
                  );
                })}

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Napomene
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    placeholder="Dodatne napomene za trebovanje..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    onClick={() => setShowOrderForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Nazad
                  </button>
                  <button
                    onClick={handleCreateOrder}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Potvrdi trebovanje
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RestaurantOrders;
