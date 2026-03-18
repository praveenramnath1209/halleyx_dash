import mongoose from 'mongoose'

// ── Widget Config Sub-Schema ──────────────────────────────────────────────────
// Each widget has a layout (position on grid) and a config (what data to show).
const widgetSchema = new mongoose.Schema(
  {
    // Frontend-assigned stable ID (kept so React keys are consistent)
    frontendId: { type: String, required: true },

    // Widget type — must match WIDGET_TYPES keys in constants.js
    type: {
      type: String,
      required: true,
      enum: ['bar', 'line', 'pie', 'area', 'scatter', 'table', 'kpi'],
    },

    // Grid position & size (all in grid units, not pixels)
    layout: {
      col: { type: Number, default: 0 },
      row: { type: Number, default: 0 },
      w:   { type: Number, default: 4 },
      h:   { type: Number, default: 4 },
    },

    // Widget display configuration (matches ConfigPanel.jsx output)
    config: {
      title:           { type: String, default: 'Untitled' },
      description:     { type: String, default: '' },
      width:           { type: Number },
      height:          { type: Number },
      color:           { type: String, default: '#5b6af9' },
      headerBg:        { type: String, default: '#54bd95' },
      fontSize:        { type: Number, default: 14 },
      // Chart-specific
      xAxis:           { type: String },
      yAxis:           { type: String },
      showLabel:       { type: Boolean, default: false },
      // Pie-specific
      pieField:        { type: String },
      showLegend:      { type: Boolean, default: false },
      // KPI-specific
      metric:          { type: String },
      aggregation:     { type: String },
      dataFormat:      { type: String, default: 'Number' },
      decimalPrecision: { type: Number, default: 0 },
      // Table-specific
      columns:         [{ type: String }],
      sortBy:          { type: String },
      pagination:      { type: String },
      applyFilter:     { type: Boolean, default: false },
      filters:         { type: mongoose.Schema.Types.Mixed, default: [] },
    },
  },
  { _id: false } // no separate _id for sub-documents
)

// ── Dashboard Schema ───────────────────────────────────────────────────────────
// Only ONE dashboard document is kept per user. We use upsert to overwrite it.
// When you add auth later, add a `userId` field here.
const dashboardSchema = new mongoose.Schema(
  {
    // Descriptive name — useful for future multi-dashboard support
    name:    { type: String, default: 'My Dashboard' },
    widgets: [widgetSchema],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Dashboard', dashboardSchema)
