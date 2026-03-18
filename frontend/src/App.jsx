import { useState, useEffect } from 'react'
import { Topbar }        from './components/UI/Topbar'
import { MobileNav }     from './components/UI/MobileNav'
import { Toasts }        from './components/UI/Toasts'
import { ConfirmDialog } from './components/UI/ConfirmDialog'
import { DashboardPage } from './components/Dashboard/DashboardPage'
import { ConfigPage }    from './components/Dashboard/ConfigPage'
import { OrdersPage }    from './components/Orders/OrdersPage'
import { fetchOrders }     from './api/orders.js'
import { fetchDashboard, saveDashboard } from './api/dashboard.js'
import { useToast }  from './hooks/useToast'
import { useTheme }  from './hooks/useTheme'

function filterByDate(orders, dateFilter) {
  if (dateFilter === 'All time') return orders
  const now = new Date()
  return orders.filter(o => {
    const d = new Date(o.orderDate)
    if (dateFilter === 'Today') return d.toDateString() === now.toDateString()
    const days = dateFilter === 'Last 7 Days' ? 7 : dateFilter === 'Last 30 Days' ? 30 : 90
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate() - days)
    return d >= cutoff
  })
}

export default function App() {
  const [tab,           setTab]           = useState('dashboard')
  const [configMode,    setConfigMode]    = useState(false)
  const [dateFilter,    setDateFilter]    = useState('All time')
  const [widgets,       setWidgets]       = useState([])
  const [savedWidgets,  setSavedWidgets]  = useState([])
  const [orders,        setOrders]        = useState([])
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [loading,       setLoading]       = useState(true)
  const { toasts, show: showToast } = useToast()
  const { theme, setTheme } = useTheme()

  const filteredOrders = filterByDate(orders, dateFilter)

  // ── Load orders + dashboard config from MongoDB on first render ──────────────
  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedOrders, fetchedWidgets] = await Promise.all([
          fetchOrders(),
          fetchDashboard(),
        ])
        setOrders(fetchedOrders)
        setSavedWidgets(fetchedWidgets)
      } catch (err) {
        showToast('⚠️ Could not reach backend. Is it running?', 'error')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSetTab = (t) => {
    setTab(t)
    if (t !== 'dashboard') setConfigMode(false)
    setMobileNavOpen(false)
  }

  const handleConfigure = () => {
    setWidgets(savedWidgets.map(w => ({ ...w })))
    setConfigMode(true)
  }

  // ── Save dashboard to MongoDB ─────────────────────────────────────────────
  const handleSave = async () => {
    try {
      const saved = await saveDashboard(widgets)
      setSavedWidgets(saved)
      setConfigMode(false)
      showToast('Dashboard saved! ✅')
    } catch (err) {
      showToast('❌ Failed to save dashboard: ' + err.message, 'error')
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--text2)', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 32 }}>⏳</div>
        <p style={{ fontSize: 14 }}>Connecting to backend…</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar
        tab={tab}
        setTab={handleSetTab}
        orderCount={orders.length}
        widgetCount={savedWidgets.length}
        onMenuToggle={() => setMobileNavOpen(v => !v)}
        menuOpen={mobileNavOpen}
        theme={theme}
        setTheme={setTheme}
      />

      {mobileNavOpen && (
        <MobileNav tab={tab} setTab={handleSetTab} onClose={() => setMobileNavOpen(false)} />
      )}

      <main style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
        {tab === 'dashboard' && !configMode && (
          <DashboardPage
            savedWidgets={savedWidgets}
            filteredOrders={filteredOrders}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onConfigure={handleConfigure}
          />
        )}
        {tab === 'dashboard' && configMode && (
          <ConfigPage
            widgets={widgets}
            setWidgets={setWidgets}
            onSave={handleSave}
            onCancel={() => setConfigMode(false)}
          />
        )}
        {tab === 'orders' && (
          <OrdersPage
            orders={orders}
            setOrders={setOrders}
            showToast={showToast}
          />
        )}
      </main>

      <ConfirmDialog dialog={confirmDialog} onClose={() => setConfirmDialog(null)} />
      <Toasts toasts={toasts} />
    </div>
  )
}
