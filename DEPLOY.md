# 🚀 Halleyx Dashboard — Free Deployment Guide

## Stack
- **Frontend** → Vercel (React + Vite)
- **Backend** → Vercel Serverless (Express)
- **Database** → MongoDB Atlas (free) or any MongoDB provider

---

## Step 1 — Database (MongoDB Atlas Free Tier)

1. Go to https://mongodb.com/atlas and sign up free
2. Create a **Free Cluster (M0)** — pick any region
3. **Database Access** → Add User → set username + password
4. **Network Access** → Add IP → `0.0.0.0/0` (allow all — needed for Vercel)
5. **Connect** → **Drivers** → Copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/halleyx
   ```
   Replace `<user>` and `<password>` with your credentials.

---

## Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/halleyx-dash.git
git push -u origin main
```

---

## Step 3 — Deploy on Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New Project"** → Import your repo
3. **IMPORTANT**: Set Root Directory to **`/`** (the repo root, not /frontend)
4. Vercel will auto-detect the `vercel.json` at the root

### Add Environment Variables (in Vercel dashboard → Settings → Environment Variables):

| Name | Value |
|------|-------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/halleyx` |
| `NODE_ENV` | `production` |
| `CLIENT_URL` | `https://your-project.vercel.app` ← set after first deploy |

5. Click **Deploy** ✅

---

## Step 4 — Verify It Works

After deploy, visit:
- `https://your-project.vercel.app` → Frontend loads
- `https://your-project.vercel.app/api` → Should return `{"message":"Halleyx API is running"}`

---

## Local Development (unchanged)

```bash
# Backend
cd backend
cp .env.example .env   # fill in your MONGO_URI
npm install
npm run dev            # runs on http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm run dev            # runs on http://localhost:5173
```

Vite's proxy is already configured to forward `/api` calls to `localhost:5000` in dev.

---

## How It Works on Vercel

```
your-project.vercel.app/
├── /api/*        → backend/server.js (Vercel Serverless Function)
└── /*            → frontend/dist     (Static React build)
```

No cold-start issues for a dashboard app. Both live on the same domain so no CORS headaches.
