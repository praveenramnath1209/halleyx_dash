# Halleyx Dashboard Builder

A full-stack custom dashboard builder where users can drag, drop, and configure data widgets on a live canvas — powered by real order data.

🔗 **Live Demo:** [https://halleyx-dash-48td.vercel.app](https://halleyx-dash-48td.vercel.app)

---

## Screenshots

> Dashboard Canvas — drag, resize, and configure widgets in real time

![Dashboard](https://halleyx-dash-48td.vercel.app/og-preview.png)

---

## Features

### 🧩 Dashboard Canvas

- Drag widgets from the panel onto a **12-column responsive grid**
- **Free drag** to rearrange — widgets auto-compact and resolve collisions
- **Corner resize handle** to change widget size
- Layouts persist to the database — your dashboard survives a page refresh

### 📊 Widget Types

| Type         | Description                                      |
| ------------ | ------------------------------------------------ |
| Bar Chart    | Compare values across categories                 |
| Line Chart   | Trend over time                                  |
| Area Chart   | Volume over time                                 |
| Pie Chart    | Distribution breakdown                           |
| Scatter Plot | Correlation between two fields                   |
| Table        | Paginated, sortable, filterable data grid        |
| KPI Card     | Single aggregated metric (Sum / Average / Count) |

### ⚙️ Per-Widget Configuration

- Custom title, colors, header background, font size
- X/Y axis field selection for charts
- Column picker, sort field, pagination for tables
- Metric + aggregation type for KPI cards
- Per-widget data filters

### 📦 Orders Management

- Full **CRUD** — create, edit, delete orders
- Right-click **context menu** on table rows
- Fields: customer info, product, quantity, unit price, status, created by
- Auto-computed: total amount, order ID, customer ID, address

### 🗓️ Date Range Filter

- Global filter (All time / Today / Last 7 / 30 / 90 Days)
- Applied live across all widgets on the canvas

### 🎨 Theme Support

- Light, Dark, and Warm themes
- Responsive layout: 12 → 8 → 4 column breakpoints for tablet/mobile

---

## Tech Stack

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Frontend   | React 18, Vite 5, CSS Modules          |
| Charts     | Chart.js, react-chartjs-2              |
| Backend    | Node.js, Express                       |
| Database   | MongoDB, Mongoose                      |
| Deployment | Vercel (frontend + serverless backend) |

---

## Local Development

### Prerequisites

- Node.js 18+
- A MongoDB connection string (MongoDB Atlas free tier works)

### Setup

```bash
# Clone the repo
git clone https://github.com/praveenramnath1209/halleyx_dash.git
cd halleyx_dash
```

```bash
# Backend
cd backend
cp .env.example .env       # fill in your MONGO_URI
npm install
npm run dev                # runs on http://localhost:5000
```

```bash
# Frontend (new terminal)
cd frontend
npm install
npm run dev                # runs on http://localhost:5173
```

Vite's dev proxy forwards all `/api/*` requests to `localhost:5000` automatically.

### Environment Variables

**Backend** (`backend/.env`):

```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.xxxxx.mongodb.net/halleyx
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

---

## Deployment

Both frontend and backend are deployed on **Vercel** from the same repo.

```
your-project.vercel.app/
├── /api/*   →  backend/server.js  (Vercel Serverless Function)
└── /*       →  frontend/dist      (Static React build)
```

See [DEPLOY.md](./DEPLOY.md) for the full step-by-step deployment guide.

---

## Project Structure

```
halleyx_dash/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # orderController, dashboardController
│   ├── models/         # Order, Dashboard (Mongoose schemas)
│   ├── routes/         # /api/orders, /api/dashboard
│   └── server.js       # Express app entry point
├── frontend/
│   └── src/
│       ├── api/        # axios client + endpoint helpers
│       ├── components/
│       │   ├── Canvas/ # DragCanvas, CanvasWidget, ConfigPanel, WidgetPanel
│       │   ├── Widgets/# ChartWidget, TableWidget, KPIWidget
│       │   ├── Orders/ # OrdersPage, OrderForm
│       │   └── UI/     # Topbar, Toasts, ThemeSwitcher, MobileNav
│       ├── hooks/      # useFreeDrag (drag + resize logic)
│       ├── data/       # constants, field definitions
│       └── styles/     # global CSS, theme variables
├── vercel.json         # Full-stack Vercel routing config
└── DEPLOY.md           # Deployment guide
```

---

## License

MIT
