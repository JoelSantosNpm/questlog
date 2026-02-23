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

## �️ Roadmap de Funcionalidades

### Sprint 1: Fundamentos y Autenticación

- [ ] **Auth**: Integración de Clerk (@clerk/nextjs) y Webhooks.
- [ ] **DB Schema**: Tabla `User` (clerkId) y relaciones con `Campaign`.
- [ ] **Rutas Base**: `/sign-in`, `/sign-up`, `/dashboard`.
- [ ] **Middleware**: Protección de rutas y gestión de sesión.

### Sprint 2: Core de Campaña & Log

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

## 📝 Siguientes Pasos Inmediatos (Sprint 1)

1. **Instalación de Dependencias:**
   - Instalar `@clerk/nextjs`.

2. **Actualización de Base de Datos:**
   - Modificar `schema.prisma` para incluir `User` y `Item` extendido.
   - Ejecutar migración.

3. **Configuración de Autenticación:**
   - Añadir variables de entorno.
   - Crear `middleware.ts`.
   - Implementar páginas de Sign In/Sign Up.
