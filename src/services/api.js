const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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
    images: Array.isArray(item.images) ? item.images.filter(Boolean) : [],
    image:
      item.image ||
      (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : null) ||
      fallbackImages[index % fallbackImages.length],
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

export async function createOrder(payload) {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchOrders() {
  const payload = await apiRequest('/orders');
  return payload.items || [];
}

export async function updateOrderStatus(orderId, status) {
  return apiRequest(`/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: 'PATCH',
  });
}

export async function fetchOrnamentById(ornamentId) {
  const payload = await apiRequest(`/ornaments/${ornamentId}`);
  return payload.item;
}

export async function deleteOrnament(ornamentId) {
  return apiRequest(`/ornaments/${ornamentId}`, {
    method: 'DELETE',
  });
}
