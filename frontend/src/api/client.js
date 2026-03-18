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
  baseURL: import.meta.env.VITE_API_URL || '/api',
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
