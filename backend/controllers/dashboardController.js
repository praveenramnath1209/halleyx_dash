import Dashboard from '../models/Dashboard.js'

// ── GET /api/dashboard — load the saved dashboard ────────────────────────────
export async function getDashboard(req, res) {
  try {
    // findOne returns null if nothing saved yet — that's fine, frontend handles []
    const dashboard = await Dashboard.findOne()
    if (!dashboard) return res.json({ widgets: [] })

    // Map frontendId back to id so React keys work without changes
    const widgets = (dashboard.widgets || []).map(mapWidget)
    res.json({ widgets })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── POST /api/dashboard — save (upsert) the dashboard ───────────────────────
export async function saveDashboard(req, res) {
  try {
    const { widgets = [] } = req.body

    // Normalize: store frontend `id` as `frontendId` to avoid ObjectId conflicts
    const normalized = widgets.map(w => ({
      frontendId: w.id || w.frontendId,
      type:       w.type,
      layout:     w.layout,
      config:     w.config,
    }))

    // upsert: update the single dashboard doc, or create it if it doesn't exist
    const dashboard = await Dashboard.findOneAndUpdate(
      {},                              // filter: match any (first) document
      { widgets: normalized },
      { new: true, upsert: true, runValidators: true }
    )

    const widgets_out = (dashboard.widgets || []).map(mapWidget)
    res.json({ message: 'Dashboard saved ✅', widgets: widgets_out })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ── Helper — convert stored widget back to frontend shape ────────────────────
function mapWidget(w) {
  return {
    id:     w.frontendId,
    type:   w.type,
    layout: w.layout,
    config: w.config,
  }
}
