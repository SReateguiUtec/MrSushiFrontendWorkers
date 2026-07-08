import { useEffect, useMemo, useState } from 'react'
import {
  Activity, ArrowRight, Bell, Bike, ChartNoAxesCombined, Check, ChefHat, ChevronRight,
  ClipboardList, Clock3, CookingPot, FlaskConical, History, LayoutDashboard, Loader2,
  LogOut, Menu, PackageCheck, Search, ShoppingBag, Sparkles, Timer,
  TrendingDown, TrendingUp, Utensils, X, type LucideIcon,
} from 'lucide-react'
import { initialOrders, Order, ordersApi, Status, statusInfo } from './data'
import { session, login as apiLogin, type WorkerUser } from './api'
import { Button } from './components/ui/button'

type Page = 'dashboard' | 'orders' | 'history' | 'stats'
const flow: Status[] = ['received', 'cooking', 'packing', 'delivery', 'delivered']

// ─── Login Page ──────────────────────────────────────────────────────────────

const DEMO_USER: WorkerUser = { nombre: 'Admin Demo', email: 'demo@mrsushi.com', role: 'admin' }

function LoginPage({ onLogin, onDemo }: { onLogin: (user: WorkerUser, token: string) => void; onDemo: () => void }) {
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
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const roleColors: Record<string, string> = {
    cocinero:   '#ed8a35',
    empacador:  '#8b5bb2',
    repartidor: '#1f9b83',
    admin:      '#5b6fd8',
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas p-4">
      {/* Ambient blobs */}
      <div className="ambient-blob h-72 w-72 bg-coral/10" style={{ top: '10%', left: '5%', animationDelay: '0s' }} />
      <div className="ambient-blob h-96 w-96 bg-blue-500/8" style={{ bottom: '15%', right: '8%', animationDelay: '-3s' }} />
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="relative grid h-16 w-16 place-items-center rounded-[20px] bg-gradient-coral text-white shadow-glow">
            <Utensils size={26} strokeWidth={2.5} />
            <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full border-2 border-canvas bg-[#ffd066] shadow-sm" />
          </div>
          <div className="text-center">
            <div className="font-display text-2xl text-text-1">Mr<span className="text-coral">Sushi</span></div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-[.2em] text-text-3">Panel de Trabajadores</div>
          </div>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-8">
          <h1 className="text-xl font-bold text-text-1">Bienvenido</h1>
          <p className="mt-1.5 text-xs text-text-3">Ingresa con tu cuenta de trabajador.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-text-3">Correo</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="cocina@mrsushi.com"
                required
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-1 outline-none placeholder:text-text-3 transition focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold text-text-3">Contraseña</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-1 outline-none placeholder:text-text-3 transition focus:border-coral/50 focus:ring-2 focus:ring-coral/15"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-coral py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:shadow-glow hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Ingresando...</> : 'Ingresar al panel'}
            </button>
          </form>

          {/* Demo mode */}
          <button
            id="demo-mode-btn"
            type="button"
            onClick={onDemo}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-xs font-semibold text-text-3 transition hover:border-coral/30 hover:text-coral"
          >
            <FlaskConical size={14} />
            Entrar en Modo Demo
          </button>

          {/* Test accounts */}
          <div className="mt-5 border-t border-border pt-5">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-wide text-text-3">Cuentas de prueba</p>
            <div className="space-y-2">
              {[
                { role: 'cocinero',   email: 'cocina@mrsushi.com',    pass: 'cocina123'   },
                { role: 'empacador',  email: 'empaque@mrsushi.com',   pass: 'empaque123'  },
                { role: 'repartidor', email: 'entrega@mrsushi.com',   pass: 'entrega123'  },
              ].map(({ role, email: e, pass }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => { setEmail(e); setPassword(pass) }}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-left transition hover:border-border-2 hover:bg-surface-3"
                >
                  <span className="h-2 w-2 rounded-full shadow-sm" style={{ background: roleColors[role] }} />
                  <span className="flex-1 text-[11px] font-semibold capitalize text-text-2">{role}</span>
                  <span className="text-[10px] text-text-3">{e}</span>
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
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-col border-r border-border bg-surface px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <Logo />
        <button className="grid h-7 w-7 place-items-center rounded-lg border border-border text-text-3 hover:text-text-1 lg:hidden" onClick={() => setOpen(false)}>
          <X size={15}/>
        </button>
      </div>

      {/* Section label */}
      <div className="mt-8 px-1 text-[9px] font-bold uppercase tracking-[.2em] text-text-3">Navegación</div>

      {/* Nav links */}
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

      {/* ── Estado del turno ─────────────────────────────── */}
      <div className="mt-6 px-1 text-[9px] font-bold uppercase tracking-[.2em] text-text-3">Estado del turno</div>

      {/* Shift clock + active count */}
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

      {/* Per-stage rows */}
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
              {/* Mini progress bar */}
              <div className="mt-2 h-0.5 w-full rounded-full bg-border">
                <div
                  className="h-0.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Completed today */}
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-border bg-surface-2 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Check size={13} className="text-emerald-400" />
          <span className="text-[10px] font-medium text-text-2">Entregados hoy</span>
        </div>
        <span className="text-[11px] font-bold text-emerald-400">{delivered + 48}</span>
      </div>

      {/* Bottom area */}
      <div className="mt-auto pt-4 space-y-3">
        {/* Tip card */}
        <div className="dot-grid relative overflow-hidden rounded-2xl border border-border-2 bg-surface-2 p-4">
          <div className="mb-2.5 grid h-8 w-8 place-items-center rounded-xl bg-[#ffd066]/15 text-[#ffd066]">
            <Sparkles size={15}/>
          </div>
          <p className="text-xs font-semibold text-text-1">Todo bajo control</p>
          <p className="mt-1 text-[10px] leading-relaxed text-text-3">Tiempo promedio 3 min menor que ayer.</p>
        </div>

        {/* User row */}
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
  const nombre = user?.nombre?.split(' ')[0] ?? 'trabajador'
  const greeting = new Date().getHours() < 12 ? 'Buenos días' : new Date().getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'

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
        <MetricCard label="Entregados hoy"  value="48"            note="Meta diaria: 65"    icon={PackageCheck} tone="bg-[#1f9b83]/15 text-[#1f9b83]" accent="#1f9b83" />
        <MetricCard label="Tiempo promedio" value="26 min"        note="Ayer: 29 min"       icon={Timer}        tone="bg-[#5b6fd8]/15 text-[#5b6fd8]" accent="#5b6fd8" />
        <MetricCard label="Ventas del turno" value="S/ 2,840"    note="Ticket prom. S/ 59" icon={TrendingUp}   tone="bg-[#8b5bb2]/15 text-[#8b5bb2]" accent="#8b5bb2" />
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
            {[
              ['#1043 salió a reparto',   'Renzo · hace 2 min',  Bike,        '#1f9b83', 'bg-[#1f9b83]/15'],
              ['#1044 terminó de empacar','Camila · hace 5 min', PackageCheck,'#8b5bb2', 'bg-[#8b5bb2]/15'],
              ['#1046 entró a cocina',    'Luis · hace 8 min',   ChefHat,     '#ed8a35', 'bg-[#ed8a35]/15'],
              ['Nuevo pedido #1048',      'Web · hace 10 min',   ShoppingBag, '#5b6fd8', 'bg-[#5b6fd8]/15'],
            ].map(([a,b,I,clr,bg],i) => {
              const Icon = I as LucideIcon
              return (
                <div key={i} className="flex gap-3">
                  <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${bg}`} style={{ color: clr as string }}>
                    <Icon size={14} strokeWidth={2}/>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-text-1">{a as string}</div>
                    <div className="mt-0.5 text-[9px] text-text-3">{b as string}</div>
                  </div>
                </div>
              )
            })}
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

  return (
    <article
      onClick={onOpen}
      className="group cursor-pointer rounded-2xl border border-border bg-surface p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-border-2 hover:shadow-card-hover"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-lg text-text-1">#{order.id}</span>
          <span className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide ${
            order.channel === 'Rappi' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'
          }`}>{order.channel}</span>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-semibold ${urgent ? 'text-coral' : 'text-text-3'}`}>
          <Clock3 size={11}/>{order.elapsed} min
          {urgent && <span className="live-dot ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-coral"/>}
        </span>
      </div>
      <div className="mt-2.5 text-[11px] font-semibold text-text-2">{order.customer}</div>
      <div className="my-3 border-t border-dashed border-border"/>
      <div className="space-y-1.5">
        {order.items.slice(0,2).map((item,i) => (
          <div key={i} className="flex text-[10px] leading-4">
            <b className="mr-2 w-4 text-text-3">{item.qty}×</b>
            <span className="text-text-2">{item.name}</span>
          </div>
        ))}
      </div>
      {order.items.length > 2 && <div className="mt-1 text-[9px] text-text-3">+ {order.items.length-2} producto más</div>}
      <button
        onClick={e => { e.stopPropagation(); onAdvance() }}
        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[10px] font-bold transition-all hover:brightness-110"
        style={{ background: `${info.color}18`, color: info.color, border: `1px solid ${info.color}30` }}
      >
        {order.status === 'delivered' ? 'Ver detalle' : info.action}
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

  const advance = async (order: Order) => {
    if (order.status === 'delivered') { openOrder(order); return }
    setAdvancing(order.id)
    try {
      await ordersApi.advance(order)
      const updated = await ordersApi.list()
      setOrders(updated)
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
            <h2 className="mt-1 font-display text-2xl text-text-1">Pedido #{order.id}</h2>
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
                    <div className="text-[11px] font-semibold text-text-1">{item.name}</div>
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
            {order.status === 'delivered' ? 'Pedido completado' : info.action}
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
        {[...orders.filter(o=>o.status==='delivered'),...initialOrders.slice(2,6)].map((o,i)=>(
          <div key={`${o.id}${i}`} className="grid grid-cols-[.6fr_1fr_.8fr_.7fr] gap-3 border-b border-border px-4 py-4 text-[11px] last:border-0 hover:bg-surface-2">
            <b className="text-text-1">#{Number(o.id)-i}</b>
            <span className="text-text-2">{o.customer}</span>
            <span className="text-text-2">{o.channel}</span>
            <b className="text-text-1">S/ {o.amount.toFixed(2)}</b>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="fade-in p-4 sm:p-6">
      <h2 className="font-display text-[26px] text-text-1">Estadísticas</h2>
      <p className="mt-0.5 text-xs text-text-3">Rendimiento de la operación durante esta semana.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard label="Eficiencia de cocina" value="94%" note="+6% esta semana"  icon={ChefHat}     tone="bg-[#ed8a35]/15 text-[#ed8a35]" accent="#ed8a35" />
        <MetricCard label="Entregas a tiempo"    value="91%" note="Objetivo: 90%"    icon={Bike}        tone="bg-[#1f9b83]/15 text-[#1f9b83]" accent="#1f9b83" />
        <MetricCard label="Reclamos"             value="1.8%" note="-0.4% vs. junio" icon={TrendingDown} tone="bg-[#5b6fd8]/15 text-[#5b6fd8]" accent="#5b6fd8" />
      </div>
      <div className="mt-4 rounded-2xl border border-border bg-surface p-6 shadow-card">
        <h3 className="text-sm font-semibold text-text-1">Tiempo promedio por etapa</h3>
        <div className="mt-7 space-y-5">
          {flow.slice(0,4).map((s,i) => {
            const vals=[4,12,6,18]
            return (
              <div key={s} className="grid grid-cols-[90px_1fr_42px] items-center gap-3 text-[10px]">
                <b className="text-text-2">{statusInfo[s].label}</b>
                <div className="h-1.5 rounded-full bg-border">
                  <div className="h-1.5 rounded-full transition-all" style={{ width:`${vals[i]*5}%`, background: statusInfo[s].color, boxShadow: `0 0 6px ${statusInfo[s].color}` }}/>
                </div>
                <span className="font-bold text-text-1">{vals[i]} min</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage]         = useState<Page>('orders')
  const [orders, setOrders]     = useState<Order[]>(initialOrders)
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

  const advanceSelected = async () => {
    if (!currentSelected || currentSelected.status === 'delivered') return
    await ordersApi.advance(currentSelected)
    const updated = await ordersApi.list()
    setOrders(updated)
  }

  const handleLogin = (worker: WorkerUser, token: string) => {
    session.save(token, worker)
    setUser(worker)
  }

  const handleDemoMode = () => { setUser(DEMO_USER) }

  const handleLogout = () => {
    session.clear()
    setUser(null)
    setOrders(initialOrders)
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} onDemo={handleDemoMode} />
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

