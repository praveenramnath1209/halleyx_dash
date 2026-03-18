/**
 * src/api/dashboard.js
 *
 * Save and load the dashboard widget configuration.
 */
import api from './client.js'

// Load the saved dashboard — returns { widgets: [...] }
export async function fetchDashboard() {
  const { data } = await api.get('/dashboard')
  return data.widgets || []
}

// Save the current widget array to the database (full upsert)
export async function saveDashboard(widgets) {
  const { data } = await api.post('/dashboard', { widgets })
  return data.widgets || []
}
