/**
 * src/api/orders.js
 *
 * All CRUD operations for Customer Orders.
 * Import and call these instead of the old setOrders() inline logic.
 */
import api from './client.js'

// Fetch all orders (most recent first)
export async function fetchOrders() {
  const { data } = await api.get('/orders')
  return data          // array of order objects with `id` field
}

// Create a new order — `orderData` is the raw form payload
export async function createOrder(orderData) {
  const { data } = await api.post('/orders', orderData)
  return data
}

// Update an existing order — `orderData.id` must be the MongoDB _id string
export async function updateOrder(orderData) {
  const { data } = await api.put(`/orders/${orderData.id}`, orderData)
  return data
}

// Delete an order by its MongoDB _id string
export async function deleteOrder(id) {
  const { data } = await api.delete(`/orders/${id}`)
  return data
}
