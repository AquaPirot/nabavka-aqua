import React from 'react';

export default function AdminDashboard() {
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
              <p className="text-2xl">0</p>
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
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                + Dodaj novi restoran
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              Još uvek nema dodatih restorana
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
