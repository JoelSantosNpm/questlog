# Estado del Proyecto: Questlog

**Última actualización:** 20 de Febrero de 2026
**Rama actual:** Implementar-layout

## 📌 Resumen de Progreso

Se ha establecido la base arquitectónica de la interfaz de usuario (UI) con un tema "Grimdark" inmersivo y se ha implementado el componente central de navegación: el Carrusel de Portales 3D. El proyecto ahora cuenta con una configuración robusta de testing unitario.

---

## 🏗 Arquitectura y configuración

### Core

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript (Strict mode)
- **Estilos:** Tailwind CSS v4 + `cn()` utility para gestión de clases condicionales.
- **Fuentes:** Google Fonts (`Inter` para UI, `MedievalSharp` para títulos).
- **Animaciones:** Framer Motion (`AnimatePresence`, `motion`).
- **Testing:** Jest + Testing Library configurado con soporte para TypeScript (`ts-jest` / `next/jest`).

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

## 📝 Pendientes / Siguientes Pasos

1. **Integración de Datos:**
   - Conectar `useCarousel` con datos reales de la base de datos (Prisma/PostgreSQL) en lugar de `mock-campaigns`.
   - Implementar Server Actions para `getCampaigns`.

2. **Página de Inicio (`page.tsx`):**
   - Integrar el `<PortalCarousel />` en la página principal.
   - Añadir pantallas de carga (Skeletons).

3. **Detalle de Campaña:**
   - Crear ruta dinámica `/campaigns/[id]`.
   - Diseñar vista del dashboard de campaña.

4. **Autenticación:**
   - Integrar sistema de login para proteger las campañas.
