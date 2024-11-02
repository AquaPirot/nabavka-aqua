import { useState, useEffect } from 'react';
import { Plus, Edit, Trash, LogOut } from 'lucide-react';

function RestaurantItems() {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantCode, setRestaurantCode] = useState('');
  const [items, setItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    available: true
  });

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

    // Učitavanje artikala restorana
    const storedItems = localStorage.getItem(`items_${code}`);
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    const itemWithId = {
      ...newItem,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    const updatedItems = [...items, itemWithId];
    setItems(updatedItems);
    localStorage.setItem(`items_${restaurantCode}`, JSON.stringify(updatedItems));
    
    setNewItem({
      name: '',
      category: '',
      unit: '',
      price: '',
      available: true
    });
    setShowAddModal(false);
  };

  const handleEditItem = (e) => {
    e.preventDefault();
    const updatedItems = items.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setItems(updatedItems);
    localStorage.setItem(`items_${restaurantCode}`, JSON.stringify(updatedItems));
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Da li ste sigurni da želite da obrišete ovaj artikal?')) {
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      localStorage.setItem(`items_${restaurantCode}`, JSON.stringify(updatedItems));
    }
  };

  const categories = [
    'TOPLI NAPICI',
    'BEZALKOHOLNA PIĆA',
    'PIVA',
    'VINA',
    'ŽESTOKA PIĆA'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{restaurantName}</h1>
              <p className="text-sm text-gray-600">Upravljanje artiklima</p>
            </div>
            <div className="flex items-center gap-4">
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
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">Lista artikala</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Dodaj novi artikal
            </button>
          </div>

          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Još uvek nema dodatih artikala
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.id} className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.category} • {item.price} RSD • {item.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowEditModal(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Dodaj novi artikal</h2>
            
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naziv artikla
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorija
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Izaberite kategoriju</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jedinica mere
                </label>
                <select
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Izaberite jedinicu</option>
                  <option value="kom">kom</option>
                  <option value="ml">ml</option>
                  <option value="gr">gr</option>
                  <option value="lit">lit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cena (RSD)
                </label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={newItem.available}
                  onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-900">
                  Dostupno za porudžbine
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Dodaj artikal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Izmeni artikal</h2>
            
            <form onSubmit={handleEditItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naziv artikla
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategorija
                </label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Izaberite kategoriju</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jedinica mere
                </label>
                <select
                  value={editingItem.unit}
                  onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Izaberite jedinicu</option>
                  <option value="kom">kom</option>
                  <option value="ml">ml</option>
                  <option value="gr">gr</option>
                  <option value="lit">lit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cena (RSD)
                </label>
                <input
                  type="number"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="0"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available-edit"
                  checked={editingItem.available}
                  onChange={(e) => setEditingItem({...editingItem, available: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="available-edit" className="ml-2 block text-sm text-gray-900">
                  Dostupno za porudžbine
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Sačuvaj izmene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
</div>
  );
}

export default RestaurantItems;
