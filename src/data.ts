import type { BackendOrder, Paso } from './api'
import * as api from './api'

export type Status = 'received' | 'cooking' | 'packing' | 'delivery' | 'delivered'
export type Channel = 'Web' | 'Rappi'

export interface TimelineStep {
  status: Status
  start?: string
  end?: string
  employee?: string
}

export interface Order {
  id: string
  customer: string
  channel: Channel
  status: Status
  elapsed: number
  amount: number
  address: string
  phone: string
  note?: string
  items: { qty: number; name: string; detail?: string; price: number }[]
  timeline: TimelineStep[]
  // Guardamos la referencia al objeto original del backend para poder avanzar el paso
  _backendOrder?: BackendOrder
}

export const statusInfo: Record<Status, { label: string; color: string; light: string; border: string; action: string }> = {
  received: { label: 'Recibidos',  color: '#5b6fd8', light: '#eef0ff', border: '#bfc7f3', action: 'Aceptar pedido'     },
  cooking:  { label: 'Cocinando',  color: '#ed8a35', light: '#fff3e7', border: '#f4c89f', action: 'Listo para empacar' },
  packing:  { label: 'Empacando',  color: '#8b5bb2', light: '#f5edfb', border: '#d6bde8', action: 'Listo para repartir'},
  delivery: { label: 'En reparto', color: '#1f9b83', light: '#e8f7f3', border: '#a9dcd1', action: 'Marcar entregado'   },
  delivered:{ label: 'Entregados', color: '#67716d', light: '#eff2f1', border: '#cbd1cf', action: 'Ver comprobante'    },
}

// ─── Mock data (se usa en modo demo sin backend) ─────────────────────────────

const FLOW: Status[] = ['received', 'cooking', 'packing', 'delivery', 'delivered']

const buildTimeline = (current: Status, base: string, workers: string[]): TimelineStep[] =>
  FLOW.map((status, i) => {
    const idx  = FLOW.indexOf(current)
    const mins = Number(base.split(':')[1]) + i * 8
    const hh   = `12:${String(mins % 60).padStart(2, '0')}`
    return {
      status,
      start:    i <= idx ? hh : undefined,
      end:      i < idx  ? `12:${String((mins + 6) % 60).padStart(2, '0')}` : undefined,
      employee: i <= idx ? workers[i % workers.length] : undefined,
    }
  })

export const initialOrders: Order[] = [
  { id: '1048', customer: 'Lucía Mendoza',   channel: 'Web',   status: 'received', elapsed: 3,  amount: 58.8, address: 'Av. San Borja Norte 123, San Borja',      phone: '987 341 220', note: 'Sin ajonjolí en el segundo maki', items: [{ qty: 1, name: 'Maki box', detail: 'Acevichado + California', price: 39.9 }, { qty: 1, name: 'Ebi Furai', detail: '5 unidades', price: 14 }, { qty: 1, name: 'Inca Kola', detail: '500 ml', price: 4.9 }], timeline: buildTimeline('received', '04', ['Andrea']) },
  { id: '1047', customer: 'Diego Salazar',    channel: 'Rappi', status: 'received', elapsed: 6,  amount: 50.8, address: 'Recojo por repartidor',                   phone: '—',           items: [{ qty: 2, name: 'Poke Ebi Furai', price: 29.9 }], timeline: buildTimeline('received', '01', ['Marco']) },
  { id: '1046', customer: 'María Paz',        channel: 'Web',   status: 'cooking',  elapsed: 12, amount: 46.9, address: 'Jr. Monte Rosa 281, Surco',               phone: '942 817 301', items: [{ qty: 1, name: 'Box 25 makis', detail: 'Tokio + Baby + Furai', price: 46.9 }], timeline: buildTimeline('cooking', '52', ['Andrea', 'Luis']) },
  { id: '1045', customer: 'Carlos Núñez',     channel: 'Web',   status: 'cooking',  elapsed: 18, amount: 65.7, address: 'Calle Las Palmeras 420, Miraflores',      phone: '993 560 118', note: 'Enviar salsa acevichada extra', items: [{ qty: 1, name: 'Super maki box', price: 54.9 }, { qty: 2, name: 'Coca-Cola', price: 4.9 }], timeline: buildTimeline('cooking', '46', ['Marco', 'César']) },
  { id: '1044', customer: 'Valentina Ríos',   channel: 'Rappi', status: 'packing',  elapsed: 24, amount: 39.9, address: 'Recojo por repartidor',                   phone: '—',           items: [{ qty: 1, name: 'Maki box', detail: 'Mr. Sushi + Philadelphia', price: 39.9 }], timeline: buildTimeline('packing', '40', ['Andrea', 'Luis', 'Camila']) },
  { id: '1043', customer: 'Joaquín Torres',   channel: 'Web',   status: 'delivery', elapsed: 32, amount: 74.8, address: 'Av. Primavera 1560, Surco',               phone: '950 227 891', items: [{ qty: 1, name: 'Box familiar', price: 69.9 }, { qty: 1, name: 'Agua San Luis', price: 4.9 }], timeline: buildTimeline('delivery', '31', ['Marco', 'César', 'Camila', 'Renzo']) },
  { id: '1042', customer: 'Ana Sofía',        channel: 'Web',   status: 'delivery', elapsed: 39, amount: 45.8, address: 'Av. Benavides 1889, Miraflores',          phone: '978 412 608', items: [{ qty: 1, name: 'Poke Salmón', price: 29.9 }, { qty: 1, name: 'Temaki Tokio', price: 15.9 }], timeline: buildTimeline('delivery', '24', ['Andrea', 'Luis', 'Camila', 'Renzo']) },
  { id: '1041', customer: 'Mateo Vargas',     channel: 'Rappi', status: 'delivered',elapsed: 41, amount: 55.8, address: 'Entregado',                               phone: '—',           items: [{ qty: 2, name: 'Hiroshima Maki', price: 25.9 }, { qty: 1, name: 'Coca-Cola', price: 4.9 }], timeline: buildTimeline('delivered', '15', ['Marco', 'César', 'Camila', 'Renzo', 'Renzo']) },
]

// ─── Mapa status backend → UI ─────────────────────────────────────────────────

const BACKEND_STATUS_MAP: Record<string, Status> = {
  PEDIDO_RECIBIDO: 'received',
  EN_COCINA:       'cooking',
  EN_EMPAQUE:      'packing',
  EN_CAMINO:       'delivery',
  ENTREGADO:       'delivered',
}

/**
 * Convierte un pedido del backend al tipo Order que usa la UI.
 */
export function mapBackendOrder(o: BackendOrder): Order {
  const status: Status  = BACKEND_STATUS_MAP[o.status] ?? 'received'
  const created         = new Date(o.createdAt)
  const elapsedMin      = Math.floor((Date.now() - created.getTime()) / 60000)

  const items = o.items.map(it => ({
    qty:   it.cantidad,
    name:  it.nombre,
    price: it.precio,
  }))

  const stepFlow: { uiStatus: Status; key: keyof BackendOrder['steps'] }[] = [
    { uiStatus: 'received', key: 'cocina'  },
    { uiStatus: 'cooking',  key: 'cocina'  },
    { uiStatus: 'packing',  key: 'empaque' },
    { uiStatus: 'delivery', key: 'entrega' },
    { uiStatus: 'delivered',key: 'entrega' },
  ]

  const timeline: TimelineStep[] = stepFlow.map(({ uiStatus, key }) => {
    const step = o.steps[key]
    const fmt  = (iso?: string) =>
      iso ? new Date(iso).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : undefined
    return {
      status:   uiStatus,
      start:    fmt(step?.startedAt),
      end:      fmt(step?.finishedAt),
      employee: step?.startedBy?.workerNombre ?? step?.finishedBy?.workerNombre,
    }
  })

  return {
    id:             o.orderId,
    customer:       o.userNombre || o.userEmail,
    channel:        o.canal === 'rappi' ? 'Rappi' : 'Web',
    status,
    elapsed:        elapsedMin,
    amount:         o.total,
    address:        o.direccion || 'Recojo por repartidor',
    phone:          '—',
    items,
    timeline,
    _backendOrder:  o,
  }
}

/**
 * Devuelve el paso (cocina/empaque/entrega) que el trabajador debe accionar ahora.
 */
export function getPasoActual(o: BackendOrder): Paso | null {
  const { steps } = o
  if (steps.cocina.status === 'DISPONIBLE'  || steps.cocina.status === 'EN_PROCESO')  return 'cocina'
  if (steps.empaque.status === 'DISPONIBLE' || steps.empaque.status === 'EN_PROCESO') return 'empaque'
  if (steps.entrega.status === 'DISPONIBLE' || steps.entrega.status === 'EN_PROCESO') return 'entrega'
  return null
}

// ─── ordersApi: conectado al backend real, con fallback a mock ────────────────

export const ordersApi = {
  /** Lista pedidos activos. Usa mock si no hay sesión iniciada. */
  list: async (): Promise<Order[]> => {
    if (!api.session.token) return initialOrders
    try {
      const { pedidos } = await api.listOrders()
      return pedidos.map(mapBackendOrder)
    } catch {
      return initialOrders
    }
  },

  /** Avanza un pedido al siguiente paso según el estado del backend. */
  advance: async (order: Order): Promise<void> => {
    const bo = order._backendOrder
    if (!bo || !api.session.token) return
    const paso = getPasoActual(bo)
    if (!paso) return
    const step = bo.steps[paso]
    if (step.status === 'DISPONIBLE') {
      await api.iniciarPaso(bo.orderId, paso)
    } else if (step.status === 'EN_PROCESO') {
      await api.completarPaso(bo.orderId, paso)
    }
  },
}
