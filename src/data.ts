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

export const initialOrders: Order[] = []

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
    customer:       typeof o.userNombre === 'string' ? o.userNombre : (o.userNombre as any)?.nombre || typeof o.userEmail === 'string' ? o.userEmail : (o.userEmail as any)?.email || 'Cliente',
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

// ─── ordersApi: conectado al backend real ────────────────────────────────────

export const ordersApi = {
  /** Lista pedidos activos del backend. */
  list: async (): Promise<Order[]> => {
    if (!api.session.token) return []
    try {
      const { pedidos } = await api.listOrders(true)
      return pedidos.map(mapBackendOrder)
    } catch {
      return []
    }
  },

  /** Avanza un pedido al siguiente paso según el estado del backend. */
  advance: async (order: Order): Promise<void> => {
    const bo = order._backendOrder
    if (!bo || !api.session.token) return
    const paso = getPasoActual(bo)
    if (!paso) {
      throw new Error('Este pedido se quedó atascado (su estado interno es PENDIENTE). Posible error del Step Functions o pedido antiguo.')
    }
    const step = bo.steps[paso]
    if (step.status === 'DISPONIBLE') {
      await api.iniciarPaso(bo.orderId, paso)
    } else if (step.status === 'EN_PROCESO') {
      await api.completarPaso(bo.orderId, paso)
    }
  },
}
