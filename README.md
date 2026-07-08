# MrSushi - Panel de Trabajadores (Kitchen Control)

Este repositorio contiene la aplicación frontend (React + Vite) para el **Panel de Trabajadores** del sistema MrSushi. Esta aplicación está diseñada específicamente para el uso interno del personal (cocineros, empacadores, repartidores y administradores), proporcionando una interfaz moderna, rápida y en tiempo real para gestionar el flujo de pedidos.

## Características Principales

- **Diseño Premium y Dark Mode:** Interfaz estética y moderna con efectos de glassmorfismo y tipografía cuidada (Inter).
- **Tablero Kanban (Drag & Drop UI):** Visualización del flujo operativo de los pedidos (`Recibidos` → `Cocinando` → `Empacando` → `En reparto` → `Entregados`).
- **Dashboard en Tiempo Real:** Métricas del turno, conteos activos por etapa y temporizador en vivo.
- **Autenticación por Roles:** Acceso seguro conectado al API de trabajadores, con vistas personalizadas por rol.

## Tecnologías Utilizadas

- **React 18** (Vite)
- **Tailwind CSS v3** (Sistema de diseño personalizado)
- **Lucide React** (Iconografía)
- **TypeScript**

## Requisitos Previos

- Node.js 18.x o superior.
- Tener desplegado el servicio **Backend de Trabajadores** para la conexión a la API.

## Configuración y Variables de Entorno

Copia el archivo `.env.example` a `.env` en la raíz del proyecto y configura la URL de la API del backend de trabajadores:

```bash
cp .env.example .env
```

**Ejemplo de `.env`:**
```env
VITE_API_URL=https://<TU-API-ID>.execute-api.us-east-1.amazonaws.com
```

## Instalación y Ejecución Local

1. Instala las dependencias:
```bash
npm install
```

2. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

3. Abre en el navegador: [http://localhost:5173](http://localhost:5173)

---

## Cuentas de Prueba Local (Modo Demo)

La aplicación incluye un botón para entrar en **Modo Demo** sin necesidad de conectarse a un backend real (mock data). Alternativamente, si conectas la app a la API, puedes usar los siguientes roles por defecto si los has inicializado en la base de datos:

- `cocina@mrsushi.com`
- `empaque@mrsushi.com`
- `entrega@mrsushi.com`
