# Estado del Proyecto: Questlog

**Última actualización:** 23 de Febrero de 2026
**Rama actual:** compound-engineering

## 📌 Resumen de Progreso

Se ha implementado el sistema de **Autenticación con Clerk** y la sincronización de usuarios con la base de datos (Lazy Sync). El esquema de Prisma se ha actualizado para soportar usuarios e inventarios extendidos. La arquitectura UI base (Grimdark) y el Carrusel 3D siguen activos.

---

## 🏗 Arquitectura y configuración

### Core

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript (Strict mode)
- **Estilos:** Tailwind CSS v4 + `cn()` utility para gestión de clases condicionales.
- **Fuentes:** Google Fonts (`Inter` para UI, `MedievalSharp` para títulos).
- **Animaciones:** Framer Motion (`AnimatePresence`, `motion`).
- **Testing:** Jest + Testing Library configurado con soporte para TypeScript (`ts-jest` / `next/jest`).
- **Auth & DB:** Clerk (Auth), Supabase (PostgreSQL), Prisma ORM.

### Layout Global (`src/app/layout.tsx`)

- **Tema:** Dark mode forzado (`neutral-950`).
- **Atmósfera:** Fondo con gradiente radial fijo ("Antorcha en la oscuridad").
- **Estructura:**
  - Header Sticky con efecto `backdrop-blur`.
  - Main Full-width (`flex-1 w-full`) sin márgenes restrictivos.
  - Footer temático.
- **Metadata:** SEO básico configurado para "Questlog | Dungeon Master Toolkit".

---

## 🧩 Componentes Implementados

### 1. Sistema de Carrusel 3D (Home/Dashboard)

Un carrusel circular infinito con efecto de perspectiva 3D para seleccionar campañas.

- **Ubicación:** `src/app/components/portal/`
- **Componentes:**
  - `PortalCarousel`: Contenedor principal, maneja el estado y renderizado.
  - `PortalCard`: Tarjeta individual con lógica de animación y visibilidad.
  - `Portal`: Componente visual base con variantes de imagen (`new` vs `existing`) y optimización de carga de imágenes (`priority`, `sizes`).
- **Características:**
  - Navegación circular infinita.
  - Soporte de teclado (Flechas Izquierda/Derecha).
  - Accesibilidad básica (`aria-label`, gestión de foco).
  - Optimización de renderizado (elementos fuera de rango se ocultan).
  - Animaciones de entrada/salida suaves.

### 2. Hooks y Lógica (`src/hooks/ui/`)

- **`useCarousel<T>`**: Hook genérico reutilizable para cualquier lógica de carrusel circular.
  - Gestión de índices segura.
  - Cálculo automático de rango visible basado en cantidad de elementos (5 vs 7).
  - Soporte para navegación por puntos (camino más corto).

### 3. Utilidades (`src/lib/`)

- **`carousel-utils.ts`**:
  - `getCircularCarousel`: Generador de arrays circulares con claves estables.
  - **Unit Tests:** `carousel-utils.test.ts` (Cobertura de casos borde, wrap-around, arrays vacíos).

---

## 📂 Estructura de Carpetas Clave

```
src/
├── app/
│   ├── components/portal/   # Componentes del Carrusel
│   ├── layout.tsx           # Layout Grimdark Full-width
│   └── globals.css          # Estilos globales
├── hooks/
│   └── ui/                  # Hooks de UI genéricos (useCarousel)
├── lib/
│   ├── carousel-utils.ts    # Lógica matemática del carrusel (+ tests)
│   └── utils.ts             # Utilidades generales (cn)
└── types/
    └── portal.ts            # Definiciones de Tipos (Campaign, CarouselItem)
```

---

## �️ Roadmap de Funcionalidades

### Sprint 1: Fundamentos y Autenticación (Completado)

- [x] **Auth**: Integración de Clerk (@clerk/nextjs) y Lazy Sync.
- [x] **DB Schema**: Tabla `User` (clerkId) y relaciones con `Campaign`.
- [x] **Rutas Base**: `/sign-in`, `/sign-up`, `/` (Protegida).
- [x] **Middleware**: `proxy.ts` (Next.js 16 conventions) para seguridad.

### Sprint 2: Core de Campaña & Log (En Progreso)

- [ ] **Dashboard**: Grid de visualización de campañas.
- [ ] **Log System**: Ruta `/campaña/[id]/log` y componente `LogEntryCard`.
- [ ] **CRUD Campaña**: Modal de creación y edición.

### Sprint 3: Sistema de Inventario

- [ ] **Schema Items**: Campos extendidos (peso, valor, imagen, atributos).
- [ ] **UI Inventario**: Ruta `/campaña/[id]/inventario` y `InventoryGrid`.
- [ ] **Interacción**: `ItemTooltip` y filtros por categoría.

### Sprint 4: Bestiario & Gestión GM

- [ ] **Schema Monstruos**: `Monster` vs `ActiveMonster`.
- [ ] **Herramientas GM**: Sincronización con Supabase y Formularios.
- [ ] **Rutas**: `/bestiario` y `/coliseo`.

---

## 📝 Siguientes Pasos Inmediatos (Sprint 2)

1. **Dashboard de Campañas:**
   - Crear Server Action `getCampaigns` filtrando por `userId`.
   - Reemplazar mock data en `useCarousel` con datos reales.

2. **Creación de Campañas:**
   - Implementar Modal con formulario de creación.
   - Server Action `createCampaign`.

3. **Bitácora de Aventuras:**
   - Crear estructura de rutas `/campaign/[id]/log`.
   - Diseñar `LogEntryCard`.
