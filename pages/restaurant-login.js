 const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ovde ćemo kasnije dodati proveru sa bazom podataka
    const restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
    const restaurant = restaurants.find(r => 
      r.code === code && 
      r.password === password &&
      r.active
    );

    if (restaurant) {
      localStorage.setItem('restaurantCode', restaurant.code);
      localStorage.setItem('restaurantName', restaurant.name);
      window.location.href = '/restaurant/dashboard';
    } else {
      setError('Pogrešan kod ili lozinka, ili je restoran deaktiviran');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Prijava za restorane</h1>
          <p className="text-gray-600 mt-2">Unesite svoje pristupne podatke</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kod restorana
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Unesite kod restorana"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Unesite lozinku"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg px-6 py-3 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
          >
            Prijavi se
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Problemi sa prijavom? Kontaktirajte administratora
          </p>
        </div>
      </div>
    </div>
  );
}
Last edited 1 minute ago


