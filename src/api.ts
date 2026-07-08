/// <reference types="vite/client" />
/**
 * api.ts — Capa de comunicación con el backend de trabajadores.
 *
 * Todas las llamadas HTTP al backend real van aquí.
 * La URL base se configura en la variable de entorno VITE_WORKERS_API_URL.
 */

const BASE_URL = (import.meta.env.VITE_WORKERS_API_URL as string) || ''

// ─── Tipos del backend ──────────────────────────────────────────────────────

export interface WorkerUser {
  nombre: string
  email: string
  role: 'cocinero' | 'empacador' | 'repartidor' | 'admin'
}

export interface BackendStep {
  status: 'PENDIENTE' | 'DISPONIBLE' | 'EN_PROCESO' | 'COMPLETADO'
  taskToken?: string
  startedAt?: string
  finishedAt?: string
  startedBy?: { workerId: string; workerNombre: string }
  finishedBy?: { workerId: string; workerNombre: string }
}

export interface BackendOrder {
  orderId: string
  tenantId: string
  userEmail: string
  userNombre: string
  items: { nombre: string; cantidad: number; precio: number }[]
  total: number
  direccion?: string
  canal: 'web' | 'rappi'
  status: string
  createdAt: string
  updatedAt: string
  steps: {
    cocina: BackendStep
    empaque: BackendStep
    entrega: BackendStep
  }
}

// ─── Sesión local ───────────────────────────────────────────────────────────

const TOKEN_KEY = 'mrsushi_worker_token'
const USER_KEY  = 'mrsushi_worker_user'

export const session = {
  get token() { return localStorage.getItem(TOKEN_KEY) },
  get user(): WorkerUser | null {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  },
  save(token: string, user: WorkerUser) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
}

// ─── Helper HTTP ─────────────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = session.token
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data as T
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<{ worker: WorkerUser; token: string }> {
  return request('/workers/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export async function listOrders(todos = false): Promise<{ pedidos: BackendOrder[]; total: number }> {
  return request(`/workers/orders${todos ? '?todos=true' : ''}`)
}

export async function getOrder(orderId: string): Promise<BackendOrder> {
  return request(`/workers/orders/${orderId}`)
}

// ─── Workflow ────────────────────────────────────────────────────────────────

export type Paso = 'cocina' | 'empaque' | 'entrega'

export async function iniciarPaso(orderId: string, step: Paso): Promise<void> {
  await request(`/workers/orders/${orderId}/steps/${step}/iniciar`, { method: 'POST' })
}

export async function completarPaso(orderId: string, step: Paso): Promise<void> {
  await request(`/workers/orders/${orderId}/steps/${step}/completar`, { method: 'POST' })
}
