const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const fallbackImages = ['/product-1.png', '/hero-ornament.png'];

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('vetrivel_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.detail || 'API request failed.');
  }

  return payload;
}

export async function fetchOrnaments() {
  const payload = await apiRequest('/ornaments');

  return payload.items.map((item, index) => ({
    ...item,
    image: item.image || fallbackImages[index % fallbackImages.length],
  }));
}

export async function fetchUsers() {
  const payload = await apiRequest('/users');
  return payload.items;
}

export async function loginUser(credentials) {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function createUser(payload) {
  return apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function inviteAdmin(payload) {
  return apiRequest('/admin/invite', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createOrnament(payload) {
  return apiRequest('/ornaments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
