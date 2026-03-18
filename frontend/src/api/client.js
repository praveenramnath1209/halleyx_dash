/**
 * src/api/client.js
 *
 * Central axios instance.
 * Every API file imports from here so the base URL is always in one place.
 */
import axios from 'axios'

const api = axios.create({
  // In development, Vite proxy handles '/api'
  // In production, we can either use a relative path (if using vercel.json rewrites)
  // or a full URL from an environment variable.
  // Always point to the /api prefix on the backend.
  // VITE_API_URL should be just the origin (e.g. http://localhost:5000).
  // Vite's dev-server proxy catches '/api/*' and forwards to the backend,
  // so '/api' works in dev even without the env variable.
  baseURL: (import.meta.env.VITE_API_URL || '') + '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Global response interceptor — logs errors in dev
api.interceptors.response.use(
  response => response,
  error => {
    const msg = error.response?.data?.error || error.message
    console.error('API Error:', msg)
    return Promise.reject(new Error(msg))
  }
)

export default api
