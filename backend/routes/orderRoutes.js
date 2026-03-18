import express from 'express'
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/orderController.js'

const router = express.Router()

// GET    /api/orders        → list all orders
router.get('/',      getOrders)

// POST   /api/orders        → create a new order
router.post('/',     createOrder)

// PUT    /api/orders/:id    → update an order by MongoDB _id
router.put('/:id',   updateOrder)

// DELETE /api/orders/:id    → delete an order by MongoDB _id
router.delete('/:id', deleteOrder)

export default router
