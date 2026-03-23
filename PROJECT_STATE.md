# Estado del Proyecto: Questlog

**Última actualización:** 17 de Marzo de 2026
**Rama actual:** m2-03-testing-la-creación-de-campañas

## 📌 Resumen de Progreso

Arquitectura base y **Milestone M1 (Auth & Infra)** completados.
Hemos completado **M2-01 (Dashboard)** y **M2-02 (Formulario de Creación de Aventuras)**. Se diseñó una Landing page, una interfaz de atrezzo para las campañas, y un sofisticado _wizard_ animado usando framer-motion, zustand, react-hook-form y sileo para la creación de la narrativa.

---

## 🏗 Arquitectura y configuración

### Core

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript (Strict mode)
- **Estilos:** Tailwind CSS v4 + `cn()` utility para gestión de clases condicionales.
- **Fuentes:** Google Fonts (`Inter` para UI, `MedievalSharp` para títulos).
- **Animaciones:** Framer Motion (`AnimatePresence`, `motion`).
- **Testing (Unit/Integration):** Vitest 4.x + Testing Library. Config: `vitest.config.ts`. Setup: `vitest.setup.ts`.
  - Tests existentes: `src/lib/carousel-utils.test.ts` (6), `src/components/campaigns/creation/CampaignCreationForm.test.tsx` (6). Total: 12 tests.
- **Testing (E2E):** Playwright con auth via `@clerk/testing`. Config: `playwright.config.ts`. Tests: `e2e/portal-de-piedra.spec.ts` (3 tests: AC 3.1, 3.2, 3.3). Requiere `E2E_CLERK_USER_EMAIL` en `.env`.
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

**Milestone:** M2: El Salón de los Héroes (Gestión de Campañas)
**Tarea completada:** M2-03: Testing de la Creación de Campañas
**Siguiente:** M3-01: Módulo de Inventario y Tesoros

---

## 🗺️ Roadmap Estratégico

### M1: El Despertar del Guardián (Auth & Infra) [COMPLETADO]

- [x] **DB Schema**: Tabla `User` (clerkId) y relaciones (Migrado). Añadido `onDelete: Cascade` para `Campaign` y `Character`.
- [x] **M1-01: Configuración de Clerk y Middleware**
  - _AC:_ ✅ Paquete instalado, `.env` configurado, `middleware.ts` protegiendo rutas excepto `/`, `/sign-in` y `/sign-up`.
- [x] **M1-02: UI para Autenticación (Sign-in/Sign-up temático)**
  - _AC:_ ✅ Rutas `/sign-in` y `/sign-up` con componentes de Clerk y estética D&D.
- [x] **M1-03: Lazy Sync (Clerk -> Prisma Upsert)**
  - _AC:_ ✅ Verificación de `userId` en Layout y creación automática en Supabase si no existe.
- [x] **M1-04: Sincronización Automática (Clerk Webhooks)**
  - _AC:_ ✅ Integración con svix, manejo de `user.deleted` (cascada) y `user.updated` (sync).
  - _Pasos:_
    1. Instalar `svix` (Hecho).
    2. Configurar `CLERK_WEBHOOK_SECRET` en `.env`. (Hecho)
    3. Crear Route Handler (`api/webhooks/clerk`) con validación de firma (Hecho).
    4. Implementar lógica de Prisma para `user.created`, `user.updated`, `user.deleted` (Hecho).
    5. Testear localmente con ngrok y Dashboard de Clerk. (Hecho)

### M2: El Salón de los Héroes (Gestión de Campañas) [COMPLETADO]

- [x] **M2-01: Dashboard de Campañas (Vista Máster)**
  - _AC:_ ✅ Fetch de Prisma + `PortalCarousel` conectado a datos reales. Estado de "Vacío" implementado.
- [x] **M2-02: Formulario de Creación de Aventuras**
  - _AC:_ ✅ Implementación de React Hook Form + Zustand + Framer Motion (LazyLoad) para la creación paso-a-paso de campañas vinculadas al usuario. Redirección automática y Toast temáticas con Sileo.
- [x] **M2-03: Testing de la Creación de Campañas**
  - _AC 1.1:_ ✅ Proyecto libre de Jest (`jest`, `ts-jest`, `jest-environment-jsdom`, `@types/jest` desinstalados).
  - _AC 1.2:_ ✅ Vitest 4.x configurado (`vitest.config.ts` + `vitest.setup.ts`) — 12/12 tests pasando.
  - _AC 1.3:_ ✅ Playwright inicializado (`playwright.config.ts`) con proyecto `setup` de auth y proyecto `chromium`.
  - _AC 2.1:_ ✅ Test de integración: `FormProvider` envuelve correctamente los inputs del formulario.
  - _AC 2.2:_ ✅ Test de integración: error de validación visible + store no avanza si el nombre está vacío.
  - _AC 2.3:_ ✅ Test de integración: `createCampaign` es llamada con los datos correctos al hacer submit en último paso.
  - _AC 3.1:_ ✅ E2E: carga de la Home pública + renderizado del `region` del Portal de Piedra en `/campaigns`.
  - _AC 3.2:_ ✅ E2E: navegación con botones Next/Prev y teclas ←→ del carrusel.
  - _AC 3.3:_ ✅ E2E: flujo completo Dot → Portal “Nueva Aventura” → Wizard (nombre + location) → redirect a `/campaigns/{id}` → campaña visible en el carrusel.
  - _AC 4.1:_ ✅ Scripts `npm run test`, `npm run test:run`, `npm run test:e2e`, `npm run test:e2e:ui` operativos.
  - _AC 4.2:_ ✅ README (EN + ES) actualizado con la estrategia de testing y variables de entorno necesarias.
  - _Nota:_ Los tests E2E requieren `E2E_CLERK_USER_EMAIL` en `.env` (usuario existente en Clerk + lazy sync hecho).

### M3: La Forja de la Enciclopedia (Datos, Imágenes y Estructuras) [EN PROGRESO]

- [x] **M3-00: Infraestructura de Imágenes (Storage)**
  - _AC 1:_ ✅ Bucket `questlog-assets` creado en Supabase (Público).
  - _AC 2:_ ✅ Políticas RLS configuradas (SELECT: anon, INSERT/UPDATE/DELETE: owner).
  - _AC 3:_ ✅ `next.config.ts` actualizado con `remotePatterns` para el hostname de Supabase.
  - _AC 4:_ ✅ Componente `ImageUploader` atomizado y funcional (validación 2MB, preview, upload).
  - _AC 5:_ ✅ Estética de "Lienzo de dibujo" implementada con esquinas decorativas dinámicas.
  - _Testing:_ ✅ Cobertura completa: Esquema (unit), Servicio (integración), Hook (lógica de estado) y Componente (UI). Estructura organizada por features en `/tests`.

- [ ] **M3-01: Reestructuración de Datos (Atómicos vs JSON)** [SIGUIENTE]
  - _Objetivo:_ Eliminar campos `Json` de estadísticas para permitir filtrado y búsquedas eficientes en DB.
  - _Cambios Prisma:_
    - `MonsterTemplate`, `ActiveMonster`, `CharacterTemplate`, `Character`: Eliminar `stats` JSON -> Agregar columnas `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `ac`, `speed`, `initiativeBonus`, `perception`.
    - Estandarizar gestión de `maxHp` y `currentHp`.
    - Tabla `Item`: Añadir `templateId`, cambiar `rarity` a Enum.
    - Nuevas Tablas: `ItemTemplate`, `AccessGrant` (Permisos compartidos), Enums (`Rarity`, `AccessType`).
    - `Campaign`: Añadir `parentCampaignId` e `imageUrl`.

- [ ] **M3-02: Hub de la Enciclopedia y Navegación**
  - _AC:_ Página `/encyclopedia` con pestañas (Bestiario, Museo, Registro) y filtros (Mis Creaciones | Públicos | Compartidos).

- [ ] **M3-03: Bestiario y Fichas de Monstruos**
  - _AC:_ Formulario unificado para `MonsterTemplate` (Librería) y `ActiveMonster` (Instancia de Campaña) con stats atómicos y upload de imagen.

- [ ] **M3-04: Módulo de Inventario y Museo**
  - _AC:_ CRUD de objetos con visualización temática según rareza y gestión de posesión (Personaje vs Mundo).

- [ ] **M3-05: Registro de Personajes (Template & Instance)**
  - _AC:_ Gestión de NPCs y Héroes con stats completos, nivel y vinculación de inventario inicial.

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

1. **M3-01: Módulo de Inventario y Tesoros** ← SIGUIENTE
   - Empezar modelo de inventario en Prisma.
   - Reflejar objetos en el dashboard individual `[id]` de cada aventura.

2. **M3-02: Bestiario y Fichas de Monstruos**
   - Buscador de monstruos + Ficha técnica (HP, AC, Stats).

---

## 🏗️ Principios Aprendidos / Refactorizaciones

- **Compound Components & Estado:** Evitar _prop-drilling_ usando `FormProvider` y extrayendo lógicas visuales de navegación de interfaces animadas hacia **Zustand**. Esto facilita aislar el DOM que maneja tags ruidosos como `<form>` y concentrar el _submit_ lejos de los mapeos visuales.
- **Micro-Interactividad:** Integrar un `isTransitioning` lock en los formularios multicapa para evitar que el usuario de doble-clic y colapse el árbol reactivo durante las animaciones de Framer Motion.
- **Optimización de Bundle:** Mover `motion` a `<LazyMotion features={domAnimation}>` y `m.div` en UI cargadas globalmente para ahorrar severos picos de ~30kb en renderizados iniciales.
- **Accesibilidad:** No utilizar `autoFocus` nativo en componentes renderizados condicionalmente ya que rompe el flujo interpretativo de los screen-readers.
- **Secuencialidad vs Paralelismo:** Promesas que no dependen una de otra como llamadas a `auth()` y extracción de `params` asincrónicos o DB, agruparlas de forma segura en un `Promise.all()`.
