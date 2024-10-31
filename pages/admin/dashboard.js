import React, { useState } from 'react';

export default function AdminDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    address: '',
    contact: '',
    phone: '',
    email: '',
    pib: ''
  });

  const handleAddRestaurant = (e) => {
    e.preventDefault();
    // Generišemo jedinstveni kod za restoran
    const code = `REST${String(restaurants.length + 1).padStart(3, '0')}`;
    // Generišemo random lozinku
    const password = Math.random().toString(36).slice(-8);
    
    const restaurantWithCode = {
      ...newRestaurant,
      code,
      password,
      active: true,
      dateAdded: new Date().toISOString()
    };

    setRestaurants([...restaurants, restaurantWithCode]);
    setNewRestaurant({
      name: '',
      address: '',
      contact: '',
      phone: '',
      email: '',
      pib: ''
    });
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Postojeći dashboard kod ostaje isti */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('isAdmin');
                window.location.href = '/admin-login';
              }}
              className="px-4 py-2 text-red-600 hover:text-red-800"
            >
              Odjavi se
            </button>
          </div>
          
          {/* Statistika */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Ukupno restorana</h3>
              <p className="text-2xl">{restaurants.length}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Aktivne narudžbe</h3>
              <p className="text-2xl">0</p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Ukupno artikala</h3>
              <p className="text-2xl">0</p>
            </div>
          </div>

          {/* Lista restorana */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Restorani</h2>
              <button 
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Dodaj novi restoran
              </button>
            </div>
            
            {restaurants.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                Još uvek nema dodatih restorana
              </div>
            ) : (
              <div className="space-y-4">
                {restaurants.map((restaurant) => (
                  <div key={restaurant.code} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-bold">{restaurant.name}</h3>
                        <p className="text-sm text-gray-600">Kod: {restaurant.code}</p>
                        <p className="text-sm text-gray-600">Kontakt: {restaurant.contact}</p>
                      </div>
                      <div className="space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">Uredi</button>
                        <button className="text-red-600 hover:text-red-800">Deaktiviraj</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal za dodavanje restorana */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Dodaj novi restoran</h2>
            
            <form onSubmit={handleAddRestaurant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Naziv restorana
                </label>
                <input
                  type="text"
                  value={newRestaurant.name}
                  onChange={(e) => setNewRestaurant({...newRestaurant, name: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresa
                </label>
                <input
                  type="text"
                  value={newRestaurant.address}
                  onChange={(e) => setNewRestaurant({...newRestaurant, address: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kontakt osoba
                </label>
                <input
                  type="text"
                  value={newRestaurant.contact}
                  onChange={(e) => setNewRestaurant({...newRestaurant, contact: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  value={newRestaurant.phone}
                  onChange={(e) => setNewRestaurant({...newRestaurant, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={newRestaurant.email}
                  onChange={(e) => setNewRestaurant({...newRestaurant, email: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PIB
                </label>
                <input
                  type="text"
                  value={newRestaurant.pib}
                  onChange={(e) => setNewRestaurant({...newRestaurant, pib: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Otkaži
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Dodaj restoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}



