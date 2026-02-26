# Estado del Proyecto: Questlog

**Última actualización:** 25 de Febrero de 2026
**Rama actual:** user-sync

## 📌 Resumen de Progreso

Arquitectura base, sistema de navegación 3D y **Milestone M1 (Auth & Infra)** completados al 85%. Las tareas M1-01 (Clerk config), M1-02 (Auth UI) y M1-03 (Lazy Sync a Supabase vía Prisma) están cerradas. Se ha actualizado el esquema de Prisma para incluir `onDelete: Cascade` en las relaciones del usuario, preparando el terreno para la eliminación de cuentas. Pendiente M1-04 (Clerk Webhooks para sync automático de actualizaciones y eliminaciones de usuario).

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

### 2. Sistema de Autenticación (Clerk)

- **Ubicación:** `src/config/`, `src/app/providers/`, `src/components/auth/`
- **Archivos:**
  - `src/config/clerk-theme.ts`: Tema Grimdark personalizado extendiendo el tema `dark` de Clerk.
  - `src/config/routes/auth.ts`: Constantes de rutas públicas y protegidas.
  - `src/app/providers/auth-provider.tsx`: Wrapper de `ClerkProvider` con tema y rutas configuradas.
  - `src/components/auth/auth-sync.tsx`: Server Component que ejecuta el Lazy Sync en cada sesión.
  - `src/proxy.ts`: Middleware de protección de rutas con `auth.protect()`.
- **Rutas protegidas:** Todo excepto `/`, `/sign-in(.*)` y `/sign-up(.*)`.

### 3. Hooks y Lógica (`src/hooks/ui/`)

- **`useCarousel<T>`**: Hook genérico reutilizable para cualquier lógica de carrusel circular.
  - Gestión de índices segura.
  - Cálculo automático de rango visible basado en cantidad de elementos (5 vs 7).
  - Soporte para navegación por puntos (camino más corto).

### 4. Utilidades (`src/lib/`)

- **`carousel-utils.ts`**:
  - `getCircularCarousel`: Generador de arrays circulares con claves estables.
  - **Unit Tests:** `carousel-utils.test.ts` (Cobertura de casos borde, wrap-around, arrays vacíos).
- **`prisma.ts`**: Singleton de Prisma Client con adaptador `PrismaPg` para conexión a Supabase.

---

## 📂 Estructura de Carpetas Clave

```
src/
├── app/
│   ├── components/portal/       # Carrusel 3D (PortalCarousel, PortalCard, Portal)
│   ├── providers/
│   │   └── auth-provider.tsx    # ClerkProvider con tema Grimdark
│   ├── sign-in/[[...sign-in]]/  # Página de login temática
│   ├── sign-up/[[...sign-up]]/  # Página de registro temática
│   ├── colosseum/               # Módulo El Coliseo (layout + page)
│   ├── layout.tsx               # Root Layout (AuthSync incluido)
│   └── globals.css              # Estilos globales
├── components/
│   └── auth/
│       └── auth-sync.tsx        # Lazy Sync Clerk -> Prisma (Server Component)
├── config/
│   ├── clerk-theme.ts           # Tema dark personalizado para Clerk
│   └── routes/auth.ts           # Constantes de rutas públicas/protegidas
├── hooks/
│   └── ui/                      # Hooks genéricos (useCarousel)
├── lib/
│   ├── prisma.ts                # Singleton PrismaClient + adaptador PrismaPg
│   ├── carousel-utils.ts        # Lógica matemática del carrusel (+ tests)
│   └── carousel-utils.test.ts
├── shared/utils/
│   └── styles.ts                # Utilidad cn()
├── types/
│   └── portal.ts                # Tipos: Campaign, CarouselItem
└── proxy.ts                     # Middleware de protección de rutas (Clerk)
```

---

## �️ Roadmap de Funcionalidades

# 🛡️ Questlog Project State

## 📍 Estado Actual

**Milestone:** M1: El Despertar del Guardián (Auth & Infra)
**Tarea completada:** M1-03: Lazy Sync (Clerk -> Prisma Upsert)
**Siguiente:** M1-04: Sincronización Automática (Clerk Webhooks)

---

## 🗺️ Roadmap Estratégico

### M1: El Despertar del Guardián (Auth & Infra) [EN PROGRESO]

- [x] **DB Schema**: Tabla `User` (clerkId) y relaciones (Migrado). Añadido `onDelete: Cascade` para `Campaign` y `Character`.
- [x] **M1-01: Configuración de Clerk y Middleware**
  - _AC:_ Paquete instalado, `.env` configurado, `middleware.ts` protegiendo rutas excepto `/`, `/sign-in` y `/sign-up`.
- [x] **M1-02: UI para Autenticación (Sign-in/Sign-up temático)**
  - _AC:_ Rutas `/sign-in` y `/sign-up` con componentes de Clerk y estética D&D.
- [x] **M1-03: Lazy Sync (Clerk -> Prisma Upsert)**
  - _AC:_ Verificación de `userId` en Layout y creación automática en Supabase si no existe.
- [ ] **M1-04: Sincronización Automática (Clerk Webhooks)**
  - _AC:_ Integración con svix, manejo de `user.deleted` y `user.updated`.

### M2: El Salón de los Héroes (Gestión de Campañas) [PENDIENTE]

- [ ] **M2-01: Dashboard de Campañas (Vista Máster)**
  - _AC:_ Fetch de Prisma + `PortalCarousel` conectado a datos reales.
- [ ] **M2-02: Formulario de Creación de Aventuras**
  - _AC:_ Server Action + Zod para crear campañas vinculadas al usuario.

### M3: El Tesoro y el Bestiario (Módulos de Datos) [PENDIENTE]

- [ ] **M3-01: Módulo de Inventario y Tesoros**
  - _AC:_ CRUD de Items + Relación con `CampaignID`.
- [ ] **M3-02: Bestiario y Fichas de Monstruos**
  - _AC:_ Buscador de monstruos + Ficha técnica (HP, AC, Stats).

### M4: Las Crónicas del Coliseo (Live Tools) [PENDIENTE]

- [ ] **M4-01: Logbook de Sesión**
  - _AC:_ Diario de campaña con persistencia y cronología.
- [ ] **M4-02: Gestor de Iniciativa (El Coliseo)**
  - _AC:_ Herramienta de turnos para combate en vivo.
- [ ] **M4-03: Pulido y Despliegue**
  - _AC:_ Optimización UI/UX y deploy en Vercel.

---

## 🛠️ Notas de Ingeniería (Compound Context)

- **Tech Stack:** Next.js (App Router), Prisma, Supabase, Clerk, Tailwind.
- **UI Estilo:** Gamificada, texturas de piedra, portales mágicos.
- **Principio:** No se avanza de Issue hasta cumplir todos sus AC (Criterios de Aceptación).
- **Testing de Base de Datos:** Se ha creado un script `prisma/seed.ts` para poblar la base de datos con datos de prueba (mock data) vinculados a un usuario real de desarrollo.
  - **Configuración:** Requiere definir `SEED_USER_EMAIL` en `.env`.
  - **Uso:** Primero inicia sesión en la app para que el usuario se sincronice en la DB. Luego ejecuta `npm run db:seed`.
  - **Resultado:** Borra campañas anteriores de ese usuario y crea nuevas campañas y personajes de prueba.

---

## 📝 Siguientes Pasos Inmediatos

1. **M1-04: Clerk Webhooks (Sync automático)**
   - Configurar endpoint `/api/webhooks/clerk` protegido con `svix`.
   - Manejar eventos `user.updated` y `user.deleted` para mantener la DB sincronizada.

2. **M2-01: Dashboard de Campañas** _(tras cerrar M1)_
   - Conectar `PortalCarousel` con campañas reales desde Prisma.
