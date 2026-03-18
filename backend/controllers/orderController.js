import Order from '../models/Order.js'

// ── GET /api/orders — list all orders ────────────────────────────────────────
export async function getOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    // Transform _id → id so the frontend's existing code stays unchanged
    const mapped = orders.map(mapOrder)
    res.json(mapped)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── POST /api/orders — create a new order ────────────────────────────────────
export async function createOrder(req, res) {
  try {
    const order = new Order(req.body)
    const saved = await order.save()
    res.status(201).json(mapOrder(saved))
  } catch (err) {
    // Mongoose validation errors have a nice message
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ error: messages.join(', ') })
    }
    res.status(500).json({ error: err.message })
  }
}

// ── PUT /api/orders/:id — update an existing order ───────────────────────────
export async function updateOrder(req, res) {
  try {
    const body = req.body

    // Re-compute derived fields on update
    const customerName = `${body.firstName} ${body.lastName}`.trim()
    const address = `${body.streetAddress}, ${body.city}, ${body.state} ${body.postalCode}, ${body.country}`
    const totalAmount = +((body.quantity || 1) * (body.unitPrice || 0)).toFixed(2)

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { ...body, customerName, address, totalAmount },
      { new: true, runValidators: true }
    )

    if (!updated) return res.status(404).json({ error: 'Order not found' })
    res.json(mapOrder(updated))
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message)
      return res.status(400).json({ error: messages.join(', ') })
    }
    res.status(500).json({ error: err.message })
  }
}

// ── DELETE /api/orders/:id — remove an order ─────────────────────────────────
export async function deleteOrder(req, res) {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Order not found' })
    res.json({ message: 'Order deleted successfully', id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── Helper — convert Mongoose doc to the shape the frontend expects ───────────
// The frontend uses `id` (string), MongoDB uses `_id` (ObjectId).
function mapOrder(doc) {
  const obj = doc.toObject()
  obj.id  = obj._id.toString()   // frontend key
  delete obj._id
  delete obj.__v
  return obj
}
