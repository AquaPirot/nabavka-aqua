import React, { useState } from 'react';
import { Copy, Plus, X } from 'lucide-react';

export default function AdminDashboard() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCredsModal, setShowCredsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [newlyAddedRestaurant, setNewlyAddedRestaurant] = useState(null);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [deactivatingRestaurant, setDeactivatingRestaurant] = useState(null);
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
    
    const code = `REST${String(restaurants.length + 1).padStart(3, '0')}`;
    const password = Math.random().toString(36).slice(-8);
    
    const restaurantWithCode = {
      ...newRestaurant,
      code,
      password,
      active: true,
      dateAdded: new Date().toISOString()
    };

    setRestaurants([...restaurants, restaurantWithCode]);
    setNewlyAddedRestaurant(restaurantWithCode);
    setShowAddModal(false);
    setShowCredsModal(true);
    setNewRestaurant({
      name: '',
      address: '',
      contact: '',
      phone: '',
      email: '',
      pib: ''
    });
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
    setShowEditModal(true);
  };

  const handleUpdateRestaurant = (e) => {
    e.preventDefault();
    const updatedRestaurants = restaurants.map(rest => 
      rest.code === editingRestaurant.code ? editingRestaurant : rest
    );
    setRestaurants(updatedRestaurants);
    setShowEditModal(false);
    setEditingRestaurant(null);
  };

  const handleDeactivateClick = (restaurant) => {
    setDeactivatingRestaurant(restaurant);
    setShowDeactivateModal(true);
  };

  const handleDeactivateConfirm = () => {
    const updatedRestaurants = restaurants.map(rest => 
      rest.code === deactivatingRestaurant.code 
        ? { ...rest, active: false }
        : rest
    );
    setRestaurants(updatedRestaurants);
    setShowDeactivateModal(false);
    setDeactivatingRestaurant(null);
  };

  const getActiveRestaurantsCount = () => {
    return restaurants.filter(r => r.active).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-bold mb-2">Ukupno restorana</h3>
              <p className="text-2xl">{restaurants.length}</p>
              <p className="text-sm text-gray-600">Aktivnih: {getActiveRestaurantsCount()}</p>
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

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Restorani</h2>
              <button 
                onClick={() => setShowAddModal(true)}
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
                  <div key={restaurant.code} 
                       className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                         !restaurant.active ? 'bg-gray-50 border-gray-200' : ''
                       }`}>
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold">{restaurant.name}</h3>
                          {!restaurant.active && (
                            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                              Neaktivan
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Kod: {restaurant.code}</p>
                        <p className="text-sm text-gray-600">Kontakt: {restaurant.contact}</p>
                      </div>
                      <div className="space-x-2">
                        <button 
                          onClick={() => handleEditRestaurant(restaurant)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Uredi
                        </button>
                        {restaurant.active ? (
                          <button 
                            onClick={() => handleDeactivateClick(restaurant)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Deaktiviraj
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              const updatedRestaurants = restaurants.map(rest => 
                                rest.code === restaurant.code 
                                  ? { ...rest, active: true }
                                  : rest
                              );
                              setRestaurants(updatedRestaurants);
                            }}
                            className="text-green-600 hover:text-green-800"
                          >
                            Aktiviraj
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal za dodavanje restorana - ostaje isti */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  onClick={() => setShowAddModal(false)}
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

      {/* Modal za kredencijale - ostaje isti */}
      {showCredsModal && newlyAddedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Kredencijali za restoran</h2>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kod restorana
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newlyAddedRestaurant.code}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newlyAddedRestaurant.code);
                      alert('Kod restorana je kopiran!');
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lozinka
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newlyAddedRestaurant.password}
                    readOnly
                    className="w-full p-2 border rounded-lg bg-white"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(newlyAddedRestaurant.password);
                      alert('Lozinka je kopirana!');
                    }}
                    className="p-2 text-blue-600 hover:text-blue-800"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-600">
              <p>Sačuvajte ove kredencijale jer će biti potrebni za prijavu na sistem.</p>
              <p className="mt-2">Preporučujemo da ih prosledite restoranu bezbednim putem.</p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowCredsModal(false);
                  setNewlyAddedRestaurant(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                U redu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal za uređivanje restorana */}
      {showEditModal && editingRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font
