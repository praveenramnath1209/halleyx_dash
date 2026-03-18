import express from 'express'
import { getDashboard, saveDashboard } from '../controllers/dashboardController.js'

const router = express.Router()

// GET  /api/dashboard  → load saved widgets
router.get('/',  getDashboard)

// POST /api/dashboard  → save (upsert) widget layout
router.post('/', saveDashboard)

export default router
