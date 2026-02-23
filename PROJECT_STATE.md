# Estado del Proyecto: Questlog

**Última actualización:** 23 de Febrero de 2026
**Rama actual:** compound-engineering

## 📌 Resumen de Progreso

Se ha establecido la arquitectura base y el sistema de navegación 3D. Actualmente se está integrando el sistema de **Autenticación con Clerk** y la persistencia de usuarios (En progreso). El esquema de base de datos ya soporta la tabla `User`.

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

# 🛡️ Questlog Project State

## 📍 Estado Actual

**Milestone:** M1: El Despertar del Guardián (Auth & Infra)
**Issue en curso:** Issue #1: Configuración técnica de Clerk y Middleware

---

## 🗺️ Roadmap Estratégico

### M1: El Despertar del Guardián (Auth & Infra) [EN PROGRESO]

- [x] **DB Schema**: Tabla `User` (clerkId) y relaciones (Migrado).
- [ ] **Issue #1: Configuración de Clerk y Middleware**
  - _AC:_ Paquete instalado, `.env` configurado, `middleware.ts` protegiendo rutas excepto `/`, `/sign-in` y `/sign-up`.
- [ ] **Issue #2: UI para Autenticación**
  - _AC:_ Rutas `/sign-in` y `/sign-up` con componentes de Clerk y estética D&D.
- [ ] **Issue #3: Lazy Sync (Clerk -> Prisma)**
  - _AC:_ Verificación de `userId` en Layout y creación automática en Supabase si no existe.

### M2: El Salón de los Héroes (Gestión de Campañas) [PENDIENTE]

- [ ] **Issue #4: Dashboard de Campañas (Vista Máster)**
  - _AC:_ Fetch de Prisma + `PortalCarousel` conectado a datos reales.
- [ ] **Issue #5: Formulario de Creación de Aventuras**
  - _AC:_ Server Action + Zod para crear campañas vinculadas al usuario.

### M3: El Tesoro y el Bestiario (Módulos de Datos) [PENDIENTE]

- [ ] **Issue #6: Módulo de Inventario y Tesoros**
  - _AC:_ CRUD de Items + Relación con `CampaignID`.
- [ ] **Issue #7: Bestiario y Fichas de Monstruos**
  - _AC:_ Buscador de monstruos + Ficha técnica (HP, AC, Stats).

### M4: Las Crónicas del Coliseo (Live Tools) [PENDIENTE]

- [ ] **Issue #8: Logbook de Sesión**
  - _AC:_ Diario de campaña con persistencia y cronología.
- [ ] **Issue #9: Gestor de Iniciativa (El Coliseo)**
  - _AC:_ Herramienta de turnos para combate en vivo.
- [ ] **Issue #10: Pulido y Despliegue**
  - _AC:_ Optimización UI/UX y deploy en Vercel.

---

## 🛠️ Notas de Ingeniería (Compound Context)

- **Tech Stack:** Next.js (App Router), Prisma, Supabase, Clerk, Tailwind.
- **UI Estilo:** Gamificada, texturas de piedra, portales mágicos.
- **Principio:** No se avanza de Issue hasta cumplir todos sus AC (Criterios de Aceptación).

---

## 📝 Siguientes Pasos Inmediatos (Sprint 1)

1. **Configuración de Autenticación:**
   - Obtener claves API de Clerk (Dashboard) y configurar `.env`.
   - Probar flujo de registro y creación de usuario en DB (Lazy Sync).
   - Verificar redirecciones del Middleware.

2. **Dashboard de Campañas (Sprint 2):**
   - Una vez autenticado, conectar `PortalCarousel` con datos reales.
