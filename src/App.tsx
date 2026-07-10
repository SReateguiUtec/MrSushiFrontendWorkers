import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, Bell, Bike, ChartNoAxesCombined, Check, ChefHat, ChevronRight,
  ClipboardList, Clock3, CookingPot, History, LayoutDashboard, Loader2,
  LogOut, Menu, PackageCheck, Search, ShoppingBag, Timer,
  TrendingDown, TrendingUp, Utensils, X, type LucideIcon,
} from 'lucide-react'
import { Order, ordersApi, Status, statusInfo, getPasoActual } from './data'
import { session, login as apiLogin, type WorkerUser } from './api'
import { Button } from './components/ui/button'
import { ToastProvider, useToast } from './components/ui/toast'

type Page = 'dashboard' | 'orders' | 'history' | 'stats'
const flow: Status[] = ['received', 'cooking', 'packing', 'delivery', 'delivered']

// ─── Login Page ──────────────────────────────────────────────────────────────

const ACCOUNTS = [
  { role: 'cocinero',   email: 'cocina@mrsushi.com',  pass: 'cocina123',  color: '#ed8a35', icon: ChefHat     },
  { role: 'empacador',  email: 'empaque@mrsushi.com', pass: 'empaque123', color: '#8b5bb2', icon: PackageCheck },
  { role: 'repartidor', email: 'entrega@mrsushi.com', pass: 'entrega123', color: '#1f9b83', icon: Bike         },
]

function LoginPage({ onLogin }: { onLogin: (user: WorkerUser, token: string) => void }) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { worker, token } = await apiLogin(email, password)
      onLogin(worker, token)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Correo o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-ink">

      {/* ── LEFT — Brand panel ───────────────────────────────────── */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-[44%] flex-col" style={{ background: '#09090b' }}>
        {/* Grid texture */}
        <div className="login-grid absolute inset-0" />
        {/* Noise overlay */}
        <div className="login-noise absolute inset-0" />

        {/* Radial gradient glow center */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 70%, rgba(239,87,71,.07) 0%, transparent 65%)' }} />

        {/* Top accent line */}
        <div className="relative z-10 flex items-center gap-3 p-10">
          <div className="h-px w-8 bg-coral/70" style={{ transformOrigin: 'left', animation: 'line-grow .8s cubic-bezier(.16,1,.3,1) .3s both' }} />
          <span className="text-[9px] font-semibold tracking-[.35em] text-coral/70 uppercase">Kitchen Control</span>
        </div>

        {/* Center decorative kanji */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-cormorant font-light leading-none"
            style={{ fontSize: '28rem', color: 'rgba(255,255,255,0.018)', letterSpacing: '-0.04em' }}>
            寿
          </span>
        </div>

        {/* Bottom brand */}
        <div className="relative z-10 mt-auto px-10 pb-10">
          <h1 className="font-cormorant font-light leading-[0.88] text-white"
            style={{ fontSize: '5.5rem', letterSpacing: '-0.02em' }}>
            Mr<br />
            <span className="italic" style={{ color: '#ef5747' }}>Sushi.</span>
          </h1>

          <div className="mt-6 h-px w-12 bg-white/15" />

          <p className="mt-5 max-w-[240px] text-[12px] font-light leading-relaxed" style={{ color: 'rgba(255,255,255,.28)' }}>
            Sistema interno de gestión de pedidos. Acceso exclusivo para el equipo operativo.
          </p>

          {/* Status pill */}
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5"
            style={{ borderColor: 'rgba(255,255,255,.07)', background: 'rgba(255,255,255,.03)' }}>
            <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[9px] font-medium tracking-[.2em] uppercase" style={{ color: 'rgba(255,255,255,.3)' }}>
              Sistema activo
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT — Login form ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-canvas">

        {/* Mobile logo (hidden on desktop) */}
        <div className="lg:hidden mb-10 text-center login-enter login-enter-1">
          <div className="font-cormorant font-light text-5xl text-text-1" style={{ letterSpacing: '-0.02em' }}>
            Mr<span className="italic" style={{ color: '#ef5747' }}>Sushi</span>
          </div>
          <div className="mt-1 text-[9px] tracking-[.3em] text-text-3 uppercase">Kitchen Control</div>
        </div>

        <div className="w-full max-w-[360px]">

          {/* Heading */}
          <div className="login-enter login-enter-1 mb-8">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="h-px w-5 bg-coral/60" />
              <span className="text-[9px] font-semibold tracking-[.28em] uppercase" style={{ color: 'rgba(239,87,71,.75)' }}>
                Acceso restringido
              </span>
            </div>
            <h2 className="font-cormorant font-light leading-tight text-text-1" style={{ fontSize: '2.6rem', letterSpacing: '-0.01em' }}>
              Bienvenido<br />
              <span className="italic">al panel.</span>
            </h2>
            <p className="mt-2 text-[12px] text-text-3">Ingresa con tu cuenta de trabajador para continuar.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="login-enter login-enter-2">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[.18em] text-text-3">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="usuario@mrsushi.com"
                required
                className="login-input"
              />
            </div>

            <div className="login-enter login-enter-3">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[.18em] text-text-3">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="login-input"
              />
            </div>

            {error && (
              <div className="login-enter rounded-lg border border-red-500/15 bg-red-500/08 px-4 py-3 text-[12px] text-red-400">
                {error}
              </div>
            )}

            <div className="login-enter login-enter-4 pt-1">
              <button type="submit" disabled={loading} className="login-btn">
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Verificando...</>
                  : 'Ingresar al panel →'}
              </button>
            </div>
          </form>

          {/* Test accounts */}
          <div className="login-enter login-enter-5 mt-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[9px] font-semibold tracking-[.2em] uppercase text-text-3">Cuentas de prueba</span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNTS.map(({ role, email: e, pass, color, icon: Icon }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setEmail(e); setPassword(pass) }}
                  className="login-account-chip"
                  style={{ '--chip-color': color } as React.CSSProperties}
                >
                  <div className="chip-icon grid h-7 w-7 place-items-center rounded-lg">
                    <Icon size={14} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] font-semibold capitalize text-text-3">{role}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className="flex items-center gap-3">
    <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-gradient-coral text-white shadow-glow-sm">
      <Utensils size={17} strokeWidth={2.5} />
      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-[1.5px] border-surface bg-[#ffd066]" />
    </div>
    {!compact && <div>
      <div className="font-display text-[18px] leading-5 text-text-1">Mr<span className="text-coral">Sushi</span></div>
      <div className="mt-0.5 text-[8px] font-bold uppercase tracking-[.22em] text-text-3">Kitchen control</div>
    </div>}
  </div>
}

const nav: { id: Page; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { id: 'orders',    label: 'Pedidos',      icon: ClipboardList },
  { id: 'history',   label: 'Historial',    icon: History },
  { id: 'stats',     label: 'Estadísticas', icon: ChartNoAxesCombined },
]

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({ page, setPage, open, setOpen, user, onLogout, orders }: {
  page: Page; setPage: (p: Page) => void
  open: boolean; setOpen: (v: boolean) => void
  user: WorkerUser | null
  onLogout: () => void
  orders: Order[]
}) {
  const initials = user?.nombre?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? 'W'

  // Live counts per stage
  const stageCounts = {
    received: orders.filter(o => o.status === 'received').length,
    cooking:  orders.filter(o => o.status === 'cooking').length,
    packing:  orders.filter(o => o.status === 'packing').length,
    delivery: orders.filter(o => o.status === 'delivery').length,
  }
  const totalActive = Object.values(stageCounts).reduce((a, b) => a + b, 0)
  const delivered   = orders.filter(o => o.status === 'delivered').length
  const urgentes    = orders.filter(o => o.elapsed >= 25 && o.status !== 'delivered').length
  const avgElapsed  = totalActive > 0
    ? Math.round(orders.filter(o => o.status !== 'delivered').reduce((a, o) => a + o.elapsed, 0) / totalActive)
    : 0
  const webCount    = orders.filter(o => o.channel === 'Web').length
  const rappiCount  = orders.filter(o => o.channel === 'Rappi').length

  // Shift clock
  const [shiftTime, setShiftTime] = useState(() => {
    const now = new Date()
    return `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
  })
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      setShiftTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`)
    }, 10_000)
    return () => clearInterval(id)
  }, [])

  const stages: { key: keyof typeof stageCounts; label: string; color: string }[] = [
    { key: 'received', label: 'Recibidos',  color: '#5b6fd8' },
    { key: 'cooking',  label: 'Cocinando',  color: '#ed8a35' },
    { key: 'packing',  label: 'Empacando',  color: '#8b5bb2' },
    { key: 'delivery', label: 'En reparto', color: '#1f9b83' },
  ]

  return <>
    {open && <button className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Cerrar menú" />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-border bg-surface transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>

      {/* ── TOP: logo + nav (fijo) ────────────────────────── */}
      <div className="shrink-0 px-4 pt-5">
        <div className="flex items-center justify-between px-1">
          <Logo />
          <button className="grid h-7 w-7 place-items-center rounded-lg border border-border text-text-3 hover:text-text-1 lg:hidden" onClick={() => setOpen(false)}>
            <X size={15}/>
          </button>
        </div>
        <div className="mt-8 px-1 text-[9px] font-bold uppercase tracking-[.2em] text-text-3">Navegación</div>
        <nav className="mt-2 space-y-0.5">
          {nav.map(item => (
            <button
              key={item.id}
              onClick={() => { setPage(item.id); setOpen(false) }}
              className={`nav-item ${page === item.id ? 'active' : ''}`}
            >
              <item.icon size={16} strokeWidth={page === item.id ? 2.2 : 1.7} />
              <span>{item.label}</span>
              {page === item.id && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_6px_rgba(239,87,71,.7)]" />}
            </button>
          ))}
        </nav>
      </div>

      {/* ── MIDDLE: stats + métricas (scrolleable) ───────── */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-2">
        <div className="mt-6 px-1 text-[9px] font-bold uppercase tracking-[.2em] text-text-3">Estado del turno</div>

        <div className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-surface-2 px-3.5 py-3">
          <div className="flex-1">
            <div className="text-[10px] text-text-3">Pedidos activos</div>
            <div className="mt-0.5 font-display text-2xl leading-none text-text-1">{totalActive}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-text-3">Hora</div>
            <div className="mt-0.5 font-mono text-sm font-bold text-text-1">{shiftTime}</div>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-coral/10">
            <Clock3 size={16} className="text-coral" />
          </div>
        </div>

        <div className="mt-2.5 space-y-1.5">
          {stages.map(({ key, label, color }) => {
            const count = stageCounts[key]
            const pct   = totalActive > 0 ? Math.round((count / totalActive) * 100) : 0
            return (
              <div key={key} className="rounded-xl border border-border bg-surface-2 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: color, boxShadow: `0 0 5px ${color}` }} />
                    <span className="text-[10px] font-medium text-text-2">{label}</span>
                  </div>
                  <span className="text-[11px] font-bold text-text-1">{count}</span>
                </div>
                <div className="mt-2 h-0.5 w-full rounded-full bg-border">
                  <div className="h-0.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <Check size={13} className="text-emerald-400" />
            <span className="text-[10px] font-medium text-text-2">Entregados hoy</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-400">{delivered}</span>
        </div>

        <div className="mt-6 px-1 text-[9px] font-bold uppercase tracking-[.2em] text-text-3">Métricas rápidas</div>

        <div className="mt-2.5 space-y-1.5">
          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5"
            style={urgentes > 0 ? { borderColor: 'rgba(239,87,71,.3)', background: 'rgba(239,87,71,.06)' } : {}}>
            <div className="flex items-center gap-2">
              {urgentes > 0
                ? <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-coral" />
                : <span className="inline-block h-1.5 w-1.5 rounded-full bg-text-3" />}
              <span className="text-[10px] font-medium text-text-2">Urgentes (&gt;25 min)</span>
            </div>
            <span className={`text-[11px] font-bold ${urgentes > 0 ? 'text-coral' : 'text-text-1'}`}>{urgentes}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Timer size={12} className="text-text-3" />
              <span className="text-[10px] font-medium text-text-2">Tiempo promedio</span>
            </div>
            <span className="text-[11px] font-bold text-text-1">{avgElapsed > 0 ? `${avgElapsed} min` : '—'}</span>
          </div>

          <div className="rounded-xl border border-border bg-surface-2 px-3 py-2.5">
            <div className="mb-2 text-[9px] font-semibold uppercase tracking-[.15em] text-text-3">Canal</div>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[10px] text-text-3">Web</span>
                <span className="text-[11px] font-bold text-blue-400">{webCount}</span>
              </div>
              <div className="h-3 w-px bg-border" />
              <div className="flex flex-1 items-center justify-between">
                <span className="text-[10px] text-text-3">Rappi</span>
                <span className="text-[11px] font-bold text-orange-400">{rappiCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: user row (fijo) ───────────────────────── */}
      <div className="shrink-0 border-t border-border px-4 py-3">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-coral/20 text-[11px] font-bold text-coral">{initials}</div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-text-1">{user?.nombre ?? 'Trabajador'}</div>
            <div className="text-[10px] capitalize text-text-3">{user?.role ?? '—'}</div>
          </div>
          <button onClick={onLogout} title="Cerrar sesión" className="grid h-7 w-7 place-items-center rounded-lg text-text-3 transition hover:bg-border hover:text-text-1">
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </aside>
  </>
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, onMenu, user }: { title: string; onMenu: () => void; user: WorkerUser | null }) {
  const initials = user?.nombre?.split(' ').map(w => w[0]).slice(0, 2).join('') ?? 'W'
  const now = new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <header className="topbar-blur sticky top-0 z-30 flex h-[64px] items-center px-4 sm:px-6">
      <button className="mr-3 grid h-8 w-8 place-items-center rounded-lg border border-border text-text-3 hover:text-text-1 lg:hidden" onClick={onMenu}>
        <Menu size={17}/>
      </button>
      <div>
        <h1 className="text-[17px] font-bold text-text-1 sm:text-lg">{title}</h1>
        <p className="hidden text-[10px] capitalize text-text-3 sm:block">{now}</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <label className="hidden h-8 w-44 items-center gap-2 rounded-xl border border-border bg-surface-2 px-3 md:flex">
          <Search size={13} className="text-text-3"/>
          <input placeholder="Buscar pedido..." className="w-full bg-transparent text-xs text-text-1 outline-none placeholder:text-text-3"/>
        </label>
        <button className="relative grid h-8 w-8 place-items-center rounded-xl border border-border bg-surface-2 text-text-2 hover:text-text-1">
          <Bell size={15}/>
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_5px_rgba(239,87,71,.6)]"/>
        </button>
        <div className="hidden h-8 items-center gap-2 rounded-xl border border-border bg-surface-2 px-2 pr-3 sm:flex">
          <div className="grid h-6 w-6 place-items-center rounded-lg bg-coral/20 text-[9px] font-bold text-coral">{initials}</div>
          <span className="text-[11px] font-semibold text-text-1">{user?.nombre?.split(' ')[0] ?? 'Trabajador'}</span>
        </div>
      </div>
    </header>
  )
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({ label, value, note, icon: Icon, tone, accent }: {
  label: string; value: string; note: string; icon: LucideIcon; tone: string; accent: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-5 transition-all duration-300 hover:border-border-2 hover:shadow-card">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
          <Icon size={18} strokeWidth={1.8}/>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-400">
          <TrendingUp size={9}/> 8.4%
        </span>
      </div>
      <div className="mt-5 text-[10px] font-medium text-text-3">{label}</div>
      <div className="mt-1 font-display text-[28px] leading-none text-text-1">{value}</div>
      <div className="mt-2 text-[10px] text-text-3">{note}</div>
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 h-px w-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ orders, goOrders, user }: { orders: Order[]; goOrders: () => void; user: WorkerUser | null }) {
  const active = orders.filter(o => o.status !== 'delivered').length
  const delivered = orders.filter(o => o.status === 'delivered')
  const entregadosHoy = delivered.length
  
  const ventasTurno = orders.reduce((sum, o) => sum + (Number(o.amount) || 0), 0)
  const ticketPromedio = orders.length > 0 ? (ventasTurno / orders.length) : 0
  
  const sourceForTime = delivered.length > 0 ? delivered : orders
  const tiempoPromedio = sourceForTime.length > 0 ? Math.round(sourceForTime.reduce((sum, o) => sum + (o.elapsed || 0), 0) / sourceForTime.length) : 0

  const nombre = user?.nombre?.split(' ')[0] ?? 'trabajador'
  const greeting = new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'

  const recentActivity = [...orders].sort((a, b) => (a.elapsed || 0) - (b.elapsed || 0)).slice(0, 4)

  return (
    <div className="fade-in p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-[11px] font-medium text-text-3">Resumen de operación</p>
          <h2 className="mt-1 font-display text-[28px] text-text-1">{greeting}, {nombre}.</h2>
        </div>
        <button
          onClick={goOrders}
          className="flex items-center gap-2 self-start rounded-xl bg-gradient-coral px-4 py-2.5 text-sm font-semibold text-white shadow-glow-sm transition hover:shadow-glow hover:brightness-110 sm:self-auto"
        >
          Ver tablero <ArrowRight size={14}/>
        </button>
      </div>

      {/* Metrics */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Pedidos activos" value={String(active)} note="En el turno actual" icon={CookingPot} tone="bg-[#ed8a35]/15 text-[#ed8a35]" accent="#ed8a35" />
        <MetricCard label="Entregados hoy"  value={String(entregadosHoy)} note="Pedidos completados" icon={PackageCheck} tone="bg-[#1f9b83]/15 text-[#1f9b83]" accent="#1f9b83" />
        <MetricCard label="Tiempo promedio" value={`${tiempoPromedio} min`} note="Por pedido" icon={Timer} tone="bg-[#5b6fd8]/15 text-[#5b6fd8]" accent="#5b6fd8" />
        <MetricCard label="Ventas del turno" value={`S/ ${ventasTurno.toFixed(2)}`} note={`Ticket prom. S/ ${ticketPromedio.toFixed(2)}`} icon={TrendingUp} tone="bg-[#8b5bb2]/15 text-[#8b5bb2]" accent="#8b5bb2" />
      </div>

      {/* Charts row */}
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_.8fr]">
        {/* Bar chart */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-1">Pedidos por hora</h3>
              <p className="mt-0.5 text-[10px] text-text-3">Volumen de hoy vs. ayer</p>
            </div>
            <select className="rounded-lg border border-border bg-surface-2 px-2 py-1.5 text-[10px] text-text-2 outline-none">
              <option>Hoy</option>
            </select>
          </div>
          <div className="mt-6 flex h-48 items-end gap-1.5 border-b border-border sm:gap-3">
            {[28,35,48,42,65,72,58,88,76,93,80,62].map((h,i) => (
              <div key={i} className="flex h-full flex-1 items-end justify-center gap-[2px]">
                <div className="bar-grow w-2/5 rounded-t-sm bg-coral/20" style={{ height:`${Math.max(12,h-12)}%`, animationDelay:`${i*25}ms` }}/>
                <div className="bar-grow w-2/5 rounded-t-sm bg-coral" style={{ height:`${h}%`, animationDelay:`${i*25+60}ms` }}/>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[9px] text-text-3">
            <span>10am</span><span>12pm</span><span>2pm</span><span>4pm</span><span>6pm</span><span>8pm</span>
          </div>
          <div className="mt-4 flex gap-4 text-[9px] text-text-3">
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-coral inline-block"/>Hoy</span>
            <span className="flex items-center gap-1.5"><i className="h-2 w-2 rounded-sm bg-coral/25 inline-block"/>Ayer</span>
          </div>
        </div>

        {/* Activity feed */}
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-1">Actividad reciente</h3>
              <p className="mt-0.5 text-[10px] text-text-3">Actualizaciones en vivo</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[9px] font-bold text-emerald-400">
              <i className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block"/> EN VIVO
            </span>
          </div>
          <div className="mt-5 space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((o,i) => {
              const sInfo = statusInfo[o.status]
              let Icon = ShoppingBag
              if (o.status === 'cooking') Icon = ChefHat
              if (o.status === 'packing') Icon = PackageCheck
              if (o.status === 'delivery') Icon = Bike
              if (o.status === 'delivered') Icon = Check

              const shortId = String(o.id).substring(0, 6).toUpperCase()
              return (
                <div key={i} className="flex gap-3">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full`} style={{ color: sInfo.color, backgroundColor: sInfo.light }}>
                    <Icon size={14} strokeWidth={2}/>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-text-1">#{shortId} {sInfo.label.toLowerCase()}</div>
                    <div className="mt-0.5 text-[9px] text-text-3">{o.channel} · hace {o.elapsed} min</div>
                  </div>
                </div>
              )
            }) : <div className="text-xs text-text-3">No hay actividad reciente.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({ order, onOpen, onAdvance }: { order: Order; onOpen: () => void; onAdvance: () => void }) {
  const info   = statusInfo[order.status]
  const urgent = order.elapsed >= 30 && order.status !== 'delivered'
  const stepStr = order._backendOrder ? getPasoActual(order._backendOrder) : null
  const isEnProceso = stepStr && order._backendOrder?.steps[stepStr]?.status === 'EN_PROCESO'

  return (
    <article
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-border bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-2 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate font-display text-lg text-text-1">#{String(order.id).substring(0,6).toUpperCase()}</span>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
            order.channel === 'Rappi' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'
          }`}>{order.channel}</span>
        </div>
        <span className={`shrink-0 flex items-center gap-1 whitespace-nowrap text-[10px] font-semibold ${urgent ? 'text-coral' : 'text-text-3'}`}>
          <Clock3 size={11} className="shrink-0"/>
          <span>{order.elapsed} min</span>
          {urgent && <span className="live-dot ml-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-coral"/>}
        </span>
      </div>
      <div className="mt-2.5 text-[11px] font-semibold text-text-2">{order.customer}</div>
      <div className="my-3 border-t border-dashed border-border"/>
      <div className="space-y-1.5">
        {order.items.slice(0,2).map((item,i) => (
          <div key={i} className="flex text-[10px] leading-4">
            <b className="mr-2 w-4 text-text-3">{item.qty}×</b>
            <span className="text-text-2">
              {typeof item.name === 'string' ? item.name : (item.name as any)?.nombre || 'Producto inválido'}
            </span>
          </div>
        ))}
      </div>
      {order.items.length > 2 && <div className="mt-1 text-[9px] text-text-3">+ {order.items.length-2} producto más</div>}
      <button
        onClick={e => { e.stopPropagation(); onAdvance() }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[10px] font-bold transition-all hover:brightness-110"
        style={
          isEnProceso
            ? { background: info.color, color: '#fff', border: `1px solid ${info.color}` }
            : { background: `${info.color}18`, color: info.color, border: `1px solid ${info.color}30` }
        }
      >
        {order.status === 'delivered' ? 'Ver detalle' : isEnProceso ? info.action : 'Marcar en proceso'}
        <ChevronRight size={12}/>
      </button>
    </article>
  )
}

// ─── OrdersBoard ─────────────────────────────────────────────────────────────

const colGlowClass: Record<Status, string> = {
  received: 'glow-received',
  cooking:  'glow-cooking',
  packing:  'glow-packing',
  delivery: 'glow-delivery',
  delivered:'',
}

function OrdersBoard({ orders, setOrders, openOrder }: { orders: Order[]; setOrders: (o: Order[]) => void; openOrder: (o: Order) => void }) {
  const [filter, setFilter] = useState<'all'|'Web'|'Rappi'>('all')
  const [advancing, setAdvancing] = useState<string | null>(null)
  const visible = filter === 'all' ? orders : orders.filter(o=>o.channel===filter)

  const { toast } = useToast()

  const advance = async (order: Order) => {
    if (order.status === 'delivered') { openOrder(order); return }
    setAdvancing(order.id)
    try {
      await ordersApi.advance(order)
      const updated = await ordersApi.list()
      setOrders(updated)
      toast('Pedido avanzado correctamente', 'success')
    } catch (e: any) {
      toast(e.message || 'Error al avanzar pedido', 'error')
    } finally {
      setAdvancing(null)
    }
  }

  return (
    <div className="fade-in flex h-[calc(100vh-64px)] flex-col overflow-hidden p-4 sm:p-6">
      {/* Header */}
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-[26px] text-text-1">Flujo de pedidos</h2>
          <p className="mt-0.5 text-[11px] text-text-3">Arrastra la operación hacia adelante, un pedido a la vez.</p>
        </div>
        {/* Channel filter */}
        <div className="flex rounded-xl border border-border bg-surface-2 p-1">
          {(['all','Web','Rappi'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold transition-all duration-200 ${
                filter === f
                  ? 'bg-coral text-white shadow-glow-sm'
                  : 'text-text-3 hover:text-text-2'
              }`}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div className="kanban-scroll flex min-h-0 flex-1 gap-3 overflow-x-auto pb-3">
        {flow.map(status => {
          const info = statusInfo[status]
          const list = visible.filter(o => o.status === status)
          return (
            <section
              key={status}
              className="flex w-[268px] min-w-[268px] flex-col rounded-[18px] border border-border bg-surface-2 p-3"
            >
              {/* Column header */}
              <div className="col-accent" style={{ '--col-color': info.color } as React.CSSProperties}>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: info.color, boxShadow: `0 0 6px ${info.color}` }}/>
                  <h3 className="text-[11px] font-bold uppercase tracking-wide text-text-2">{info.label}</h3>
                  <span className="ml-auto rounded-full border border-border bg-surface px-2 py-0.5 text-[9px] font-bold text-text-3">{list.length}</span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-2.5 overflow-y-auto px-0.5 pb-1">
                {list.map(o => (
                  <div key={o.id} className={advancing === o.id ? 'pointer-events-none opacity-50' : ''}>
                    <OrderCard order={o} onOpen={() => openOrder(o)} onAdvance={() => advance(o)}/>
                  </div>
                ))}
                {!list.length && (
                  <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border py-10 text-center text-[10px] text-text-3">
                    Sin pedidos<br/>en esta etapa
                  </div>
                )}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

// ─── OrderDetail ──────────────────────────────────────────────────────────────

function OrderDetail({ order, onClose, onAdvance }: { order: Order; onClose: () => void; onAdvance: () => void }) {
  const info = statusInfo[order.status]
  return (
    <div
      className="fixed inset-0 z-[70] flex justify-end bg-black/60 backdrop-blur-sm"
      onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <aside className="fade-in h-full w-full overflow-y-auto border-l border-border bg-surface shadow-2xl sm:max-w-[500px]">
        {/* Sticky header */}
        <div className="topbar-blur sticky top-0 z-10 flex items-center justify-between px-5 py-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.15em] text-text-3">Detalle del pedido</p>
            <h2 className="mt-1 font-display text-2xl text-text-1">Pedido #{String(order.id).substring(0,6).toUpperCase()}</h2>
          </div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2 text-text-3 hover:text-text-1">
            <X size={15}/>
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status banner */}
          <div
            className="flex items-center justify-between rounded-2xl border p-4"
            style={{ borderColor: `${info.color}35`, background: `${info.color}12` }}
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-surface" style={{ color: info.color }}>
                <Activity size={16}/>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase text-text-3">Estado actual</div>
                <div className="text-sm font-bold" style={{ color: info.color }}>{info.label}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-text-3">Tiempo total</div>
              <div className="text-sm font-bold text-text-1">{order.elapsed} min</div>
            </div>
          </div>

          {/* Customer / channel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <div className="text-[9px] text-text-3">Cliente</div>
              <div className="mt-1 text-xs font-bold text-text-1">{order.customer}</div>
              <div className="mt-1 text-[9px] text-text-3">{order.phone}</div>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 p-3">
              <div className="text-[9px] text-text-3">Origen</div>
              <div className="mt-1 text-xs font-bold text-text-1">{order.channel}</div>
              <div className="mt-1 text-[9px] text-emerald-400">Pago confirmado</div>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-border bg-surface-2 p-3">
            <div className="text-[9px] text-text-3">Entrega</div>
            <div className="mt-1 text-xs font-semibold text-text-1">{order.address}</div>
          </div>

          {/* Note */}
          {order.note && (
            <div className="rounded-xl border border-[#ffd066]/20 bg-[#ffd066]/08 p-3">
              <div className="text-[9px] font-bold uppercase text-[#ffd066]">Nota del cliente</div>
              <p className="mt-1 text-[11px] text-text-2">{order.note}</p>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="mb-2.5 text-xs font-bold text-text-1">Productos</h3>
            <div className="overflow-hidden rounded-2xl border border-border bg-surface-2">
              {order.items.map((item,i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border p-3 last:border-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-surface text-[10px] font-bold text-text-2">{item.qty}×</span>
                  <div className="flex-1">
                    <div className="text-[11px] font-semibold text-text-1">
                      {typeof item.name === 'string' ? item.name : (item.name as any)?.nombre || 'Producto inválido'}
                    </div>
                    {item.detail && <div className="mt-0.5 text-[9px] text-text-3">{item.detail}</div>}
                  </div>
                  <span className="text-[10px] font-bold text-text-1">S/ {(item.price*item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between bg-surface-3 p-3 text-xs font-bold text-text-1">
                <span>Total</span>
                <span>S/ {order.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="mb-3 text-xs font-bold text-text-1">Línea de tiempo</h3>
            <div>
              {order.timeline.map((step,i) => {
                const complete = flow.indexOf(step.status) < flow.indexOf(order.status)
                const current  = step.status === order.status
                const si       = statusInfo[step.status]
                return (
                  <div key={step.status} className="relative flex min-h-[64px] gap-3">
                    {i < flow.length-1 && (
                      <div className={`absolute left-[11px] top-6 h-[calc(100%-4px)] w-px ${complete ? '' : 'bg-border'}`}
                        style={complete ? { background: `${si.color}50` } : {}}
                      />
                    )}
                    <div className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 bg-surface ${
                      complete ? 'text-emerald-400' : current ? 'text-coral' : 'border-border text-transparent'
                    }`} style={{
                      borderColor: complete ? '#1f9b8360' : current ? '#ef574760' : undefined,
                    }}>
                      {complete ? <Check size={11}/> : current ? <i className="h-1.5 w-1.5 rounded-full bg-coral inline-block"/> : null}
                    </div>
                    <div className="flex flex-1 justify-between pb-4">
                      <div>
                        <div className={`text-[10px] font-bold ${!step.start ? 'text-text-3' : 'text-text-1'}`}>{si.label}</div>
                        <div className="mt-0.5 text-[9px] text-text-3">{step.employee||'Pendiente de asignación'}</div>
                      </div>
                      <div className="text-right text-[9px] text-text-3">
                        <div>{step.start||'—'}</div>
                        {step.end && <div className="mt-1">Fin {step.end}</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onAdvance}
            disabled={order.status === 'delivered'}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-coral py-3.5 text-xs font-bold text-white shadow-glow-sm transition hover:shadow-glow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {order.status === 'delivered' ? 'Pedido completado' : (
              (order._backendOrder && getPasoActual(order._backendOrder) && order._backendOrder.steps[getPasoActual(order._backendOrder)!]?.status === 'EN_PROCESO') 
                ? info.action
                : 'Marcar en proceso'
            )}
            <ArrowRight size={13}/>
          </button>
        </div>
      </aside>
    </div>
  )
}

// ─── PlaceholderPage ──────────────────────────────────────────────────────────

function PlaceholderPage({ page, orders }: { page: 'history'|'stats'; orders: Order[] }) {
  if (page === 'history') return (
    <div className="fade-in p-4 sm:p-6">
      <h2 className="font-display text-[26px] text-text-1">Historial de pedidos</h2>
      <p className="mt-0.5 text-xs text-text-3">Consulta y audita los pedidos completados.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <div className="grid grid-cols-[.6fr_1fr_.8fr_.7fr] gap-3 border-b border-border bg-surface-2 px-4 py-3 text-[9px] font-bold uppercase tracking-wide text-text-3">
          <span>Pedido</span><span>Cliente</span><span>Canal</span><span>Total</span>
        </div>
        {orders.filter(o=>o.status==='delivered').map((o,i)=>(
          <div key={`${o.id}${i}`} className="grid grid-cols-[.6fr_1fr_.8fr_.7fr] gap-3 border-b border-border px-4 py-4 text-[11px] last:border-0 hover:bg-surface-2">
            <b className="text-text-1">#{String(o.id).substring(0,6).toUpperCase()}</b>
            <span className="text-text-2">{o.customer}</span>
            <span className="text-text-2">{o.channel}</span>
            <b className="text-text-1">S/ {o.amount.toFixed(2)}</b>
          </div>
        ))}
      </div>
    </div>
  )

  const totalOrders = orders.length
  const deliveredOrders = orders.filter(o => o.status === 'delivered')
  const entregados = deliveredOrders.length
  
  // Calcular promedios de tiempo por etapa
  const times = { received: [] as number[], cooking: [] as number[], packing: [] as number[], delivery: [] as number[] }
  let onTimeCount = 0

  orders.forEach(o => {
    const bo = o._backendOrder
    if (!bo) return
    const created = new Date(bo.createdAt).getTime()
    
    if (bo.steps.cocina?.startedAt) {
      times.received.push((new Date(bo.steps.cocina.startedAt).getTime() - created) / 60000)
    }
    if (bo.steps.cocina?.startedAt && bo.steps.cocina?.finishedAt) {
      times.cooking.push((new Date(bo.steps.cocina.finishedAt).getTime() - new Date(bo.steps.cocina.startedAt).getTime()) / 60000)
    }
    if (bo.steps.empaque?.startedAt && bo.steps.empaque?.finishedAt) {
      times.packing.push((new Date(bo.steps.empaque.finishedAt).getTime() - new Date(bo.steps.empaque.startedAt).getTime()) / 60000)
    }
    if (bo.steps.entrega?.startedAt && bo.steps.entrega?.finishedAt) {
      times.delivery.push((new Date(bo.steps.entrega.finishedAt).getTime() - new Date(bo.steps.entrega.startedAt).getTime()) / 60000)
    }

    if (o.status === 'delivered' && o.elapsed <= 45) {
      onTimeCount++
    }
  })

  const avg = (arr: number[]) => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0
  const averages = {
    received: avg(times.received),
    cooking: avg(times.cooking),
    packing: avg(times.packing),
    delivery: avg(times.delivery)
  }

  const avgTotalTime = entregados > 0 ? Math.round(deliveredOrders.reduce((sum, o) => sum + o.elapsed, 0) / entregados) : 0
  const onTimePercent = entregados > 0 ? Math.round((onTimeCount / entregados) * 100) : 100
  const cookingAvgStr = averages.cooking > 0 ? `${averages.cooking} min` : '-'

  return (
    <div className="fade-in p-4 sm:p-6">
      <h2 className="font-display text-[26px] text-text-1">Estadísticas</h2>
      <p className="mt-0.5 text-xs text-text-3">Rendimiento de la operación durante esta semana.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="T. Prom. de Cocina" value={cookingAvgStr} note="Tiempo neto cocinando"  icon={ChefHat}     tone="bg-[#ed8a35]/15 text-[#ed8a35]" accent="#ed8a35" />
        <MetricCard label="Entregas < 45 min"    value={`${onTimePercent}%`} note="Objetivo: 90%"    icon={Bike}        tone="bg-[#1f9b83]/15 text-[#1f9b83]" accent="#1f9b83" />
        <MetricCard label="Tiempo Total"             value={`${avgTotalTime} min`} note="Promedio de pedido completo" icon={Timer} tone="bg-[#5b6fd8]/15 text-[#5b6fd8]" accent="#5b6fd8" />
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h3 className="text-sm font-semibold text-text-1">Tiempo promedio por etapa</h3>
        <div className="mt-7 space-y-5">
          {flow.slice(0,4).map((s) => {
            const val = averages[s as keyof typeof averages] || 0
            // Máximo visual de 30 min (para que la barra no se desborde si el tiempo es muy alto)
            const widthPercent = Math.min((val / 30) * 100, 100)
            return (
              <div key={s} className="grid grid-cols-[90px_1fr_42px] items-center gap-3 text-[10px]">
                <b className="text-text-2">{statusInfo[s].label}</b>
                <div className="h-1.5 rounded-full bg-border">
                  <div className="h-1.5 rounded-full transition-all" style={{ width:`${widthPercent}%`, background: statusInfo[s].color, boxShadow: `0 0 6px ${statusInfo[s].color}` }}/>
                </div>
                <span className="font-bold text-text-1">{val} min</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

function App() {
  const [page, setPage]         = useState<Page>('orders')
  const [orders, setOrders]     = useState<Order[]>([])
  const [selected, setSelected] = useState<Order | null>(null)
  const [menu, setMenu]         = useState(false)
  const [user, setUser]         = useState<WorkerUser | null>(session.user)

  useEffect(() => { ordersApi.list().then(setOrders) }, [user])

  useEffect(() => {
    const id = setInterval(() => { ordersApi.list().then(setOrders) }, 15_000)
    return () => clearInterval(id)
  }, [user])

  const currentSelected = useMemo(
    () => selected ? orders.find(o => o.id === selected.id) || selected : null,
    [orders, selected],
  )

  const { toast } = useToast()

  const advanceSelected = async () => {
    if (!currentSelected || currentSelected.status === 'delivered') return
    try {
      await ordersApi.advance(currentSelected)
      const updated = await ordersApi.list()
      setOrders(updated)
      toast('Pedido avanzado correctamente', 'success')
    } catch (e: any) {
      toast(e.message || 'Error al avanzar pedido', 'error')
    }
  }

  const handleLogin = (worker: WorkerUser, token: string) => {
    session.save(token, worker)
    setUser(worker)
  }

  const handleLogout = () => {
    session.clear()
    setUser(null)
    setOrders([])
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  const titles = { dashboard: 'Dashboard', orders: 'Pedidos', history: 'Historial', stats: 'Estadísticas' }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar page={page} setPage={setPage} open={menu} setOpen={setMenu} user={user} onLogout={handleLogout} orders={orders}/>
      <main className="min-h-screen lg:ml-[240px]">
        <Topbar title={titles[page]} onMenu={() => setMenu(true)} user={user}/>
        {page === 'dashboard' && <Dashboard orders={orders} goOrders={() => setPage('orders')} user={user}/>}
        {page === 'orders'    && <OrdersBoard orders={orders} setOrders={setOrders} openOrder={setSelected}/>}
        {(page === 'history' || page === 'stats') && <PlaceholderPage page={page} orders={orders}/>}
      </main>
      {currentSelected && <OrderDetail order={currentSelected} onClose={() => setSelected(null)} onAdvance={advanceSelected}/>}
    </div>
  )
}

// ─── Root with providers ──────────────────────────────────────────────────────

export default function AppRoot() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}
