import mongoose from 'mongoose'

// ── Order Schema ─────────────────────────────────────────────────────────────
// Mirrors exactly what OrderForm.jsx submits so there's a 1-to-1 mapping.
const orderSchema = new mongoose.Schema(
  {
    // Customer information
    firstName:     { type: String, required: [true, 'First name is required'] },
    lastName:      { type: String, required: [true, 'Last name is required'] },
    email:         { type: String, required: [true, 'Email is required'] },
    phone:         { type: String, required: [true, 'Phone is required'] },
    streetAddress: { type: String, required: [true, 'Street address is required'] },
    city:          { type: String, required: [true, 'City is required'] },
    state:         { type: String, required: [true, 'State is required'] },
    postalCode:    { type: String, required: [true, 'Postal code is required'] },
    country:       { type: String, required: [true, 'Country is required'] },

    // Computed helpers (stored so they're searchable / sortable)
    customerName:  { type: String },
    customerId:    { type: String },
    address:       { type: String },

    // Order information
    orderId:      { type: String, unique: true },
    orderDate:    { type: String },
    product:      { type: String, required: [true, 'Product is required'] },
    quantity:     { type: Number, required: [true, 'Quantity is required'], min: [1, 'Quantity must be at least 1'] },
    unitPrice:    { type: Number, required: [true, 'Unit price is required'], min: [0, 'Unit price must be >= 0'] },
    totalAmount:  { type: Number },

    // Meta
    status:    { type: String, enum: ['Pending', 'In progress', 'Completed'], default: 'Pending' },
    createdBy: { type: String, required: [true, 'Created by is required'] },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
)

// Auto-generate orderId and customerId before saving a new document
orderSchema.pre('save', function (next) {
  if (this.isNew) {
    if (!this.orderId)    this.orderId    = 'ORD-' + String(Math.floor(Math.random() * 90000) + 10000)
    if (!this.customerId) this.customerId = 'C'    + String(Math.floor(Math.random() * 9000)  + 1000)
    if (!this.orderDate)  this.orderDate  = new Date().toISOString().split('T')[0]
    this.customerName = `${this.firstName} ${this.lastName}`.trim()
    this.address = `${this.streetAddress}, ${this.city}, ${this.state} ${this.postalCode}, ${this.country}`
    this.totalAmount = +(this.quantity * this.unitPrice).toFixed(2)
  }
  next()
})

export default mongoose.model('Order', orderSchema)
