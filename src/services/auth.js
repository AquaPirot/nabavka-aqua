// src/services/auth.js

export async function loginUser(email, password) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

export function isAuthenticated() {
  return !!localStorage.getItem('token');
}

export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  };

  const response = await fetch(url, { ...options, ...defaultOptions });
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser();
    }
    throw new Error(data.error || 'API call failed');
  }

  return data;
}
