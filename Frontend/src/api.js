let base = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
if (base.endsWith('/')) base = base.slice(0, -1);
if (!base.endsWith('/api')) base += '/api';
export const API_BASE = base;

export async function fetchApi(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = localStorage.getItem('vendorBridge_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = errorText || response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed && parsed.message) {
        errorMessage = parsed.message;
      }
    } catch (e) {
      // Keep original errorText if JSON parsing fails
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
