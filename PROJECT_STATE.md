# Estado del Proyecto: Questlog

**Última actualización:** 24 de Abril de 2026
**Rama actual:** m3-02page-enciclopedia

## 📌 Resumen de Progreso

Arquitectura base y **Milestone M1 (Auth & Infra)** completados. **M2 (Gestión de Campañas)** completado al 100%.
Hemos completado **M3-01 (Reestructuración de Datos)**: migración a columnas atómicas de stats, nuevas tablas `ItemTemplate` y `AccessGrant`, enum `Rarity`, y documentación del schema bilingüe. Hemos completado también **A02 (Eliminar Prisma)**: la app usa ahora Prisma directamente como ORM de runtime con cliente ligero. **M3-02** completado: enciclopedia con navegación por pestañas, vista de detalle animada, cadena de fallback de imágenes con indicadores visuales, y suite completa de tests unitarios y E2E. **Refactorización a Feature-Sliced Design (FSD) completada**: estructura de `src/` reorganizada con capas canónicas, imports públicos a través de `index.ts` de cada slice, y código de dominio reubicado fuera de `shared/`. **Refactorización a Server Actions (Prisma)**: todas las queries y mutations de campañas y enciclopedia usan Prisma con server actions, sin route handlers. **Control de acceso por visibilidad**: campañas públicas accesibles sin autenticación; campañas privadas solo para su dueño (404 para el resto). **Suite de tests de campañas ampliada**: 29 nuevos tests cubriendo queries, hooks y mutations.

---

## 🏗 Arquitectura y configuración

### Core

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript (Strict mode)
- **Estilos:** Tailwind CSS v4 + `cn()` utility para gestión de clases condicionales.
- **Fuentes:** Google Fonts (`Inter` para UI, `MedievalSharp` para títulos).
- **Animaciones:** Framer Motion (`AnimatePresence`, `motion`).
- **Testing (Unit/Integration):** Vitest 4.x + Testing Library. Config: `vitest.config.ts`. Setup: `vitest.setup.ts`.
  - Tests centralizados en `tests/features/`. **137 tests pasando** en 15 archivos: carousel utils (6), storage service (3), storage schema (4), useImageUploader (6), ImageUploader UI (4), CampaignCreationForm (6), encyclopediaStore (9), image-fallbacks (17), ListView (13), ItemHeader (22), EncyclopediaImage (10), **campaign-queries (11)**, **campaign-hooks (9)**, **campaign-mutations (9)**.
- **Testing (E2E):** Playwright con auth via `@clerk/testing`. Config: `playwright.config.ts`. Tests: `e2e/portal-de-piedra.spec.ts` (3 tests: AC 3.1, 3.2, 3.3), `e2e/encyclopedia.spec.ts` (8 tests, 1 skip). Requiere `E2E_CLERK_USER_EMAIL` en `.env`.
- **Auth & DB:** Clerk (Auth), Supabase/PostgreSQL (host). **Prisma Client** como ORM de runtime para todas las queries y mutations (server actions). `schema.prisma` es la única fuente de verdad: tipos TypeScript via `prisma generate`, migraciones SQL via CLI, y queries en runtime. `@supabase/supabase-js` se usa únicamente para operaciones de **Storage** (imágenes).

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

- **Ubicación:** `src/views/portal/ui/`
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

- **Ubicación:** `src/shared/config/`, `src/app/providers/`, `src/app/auth/`
  - **Archivos:**
    - `src/shared/config/clerk-theme.ts`: Tema Grimdark personalizado extendiendo el tema `dark` de Clerk.
    - `src/shared/config/routes/auth.ts`: Constantes de rutas públicas y protegidas.
    - `src/app/providers/auth-provider.tsx`: Wrapper de `ClerkProvider` con tema y rutas configuradas.
    - `src/app/auth/auth-sync.tsx`: Server Component que ejecuta el Lazy Sync en cada sesión.
  - `src/middleware.ts`: Middleware de protección de rutas con `auth.protect()` (ubicación requerida por Next.js).
- **Rutas protegidas:** Todo excepto `/`, `/sign-in(.*)`, `/sign-up(.*)` y detalles de campañas públicas (`/campaigns/[id]` cuando `isPublic: true`).

### 3. Hooks y Lógica (`src/views/portal/lib/`)

- **`useCarousel<T>`**: Hook genérico reutilizable para cualquier lógica de carrusel circular.
  - Gestión de índices segura.
  - Cálculo automático de rango visible basado en cantidad de elementos (5 vs 7).
  - Soporte para navegación por puntos (camino más corto).

### 4. Utilidades (`src/views/portal/lib/`)

- **`carousel-utils.ts`**:
  - `getCircularCarousel`: Generador de arrays circulares con claves estables.
  - **Unit Tests:** `tests/features/ui/utils/carousel-utils.test.ts` (Cobertura de casos borde, wrap-around, arrays vacíos).

### 5. Enciclopedia (`src/views/encyclopedia/`)

- **`encyclopediaStore`** (Zustand): Estado global de sección activa, item seleccionado y listas por sección. Selectores granulares para evitar re-renders no necesarios.
- **`EncyclopediaImage`**: Imagen principal del item con cadena de fallback (`imageUrl` → `portraitImageUrl` → default). Muestra indicador `OctagonAlert` si la URL está vacía o falla al cargar. Notifica al componente padre mediante `onMissingChange`.
- **`PortraitFrame`**: Marco decorativo circular con variantes de color por sección (rojo bestiario, azul elenco). Acepta `showBadge` para mostrar el indicador de imagen no disponible en el retrato.
- **`ItemHeader`**: Encabezado del detalle con sección, nombre e imagen de retrato. Muestra `OctagonAlert` en el label de sección en museo cuando `imageMissing` es `true`, y en el `PortraitFrame` cuando el retrato falla o está vacío.
- **`DetailView`**: Orquestador del panel de detalle. Eleva el estado `imageMissing` desde `EncyclopediaImage` y lo pasa a `ItemHeader` para el indicador del museo.
- **`image-fallbacks.ts`**: Funciones puras `getEntityFallbacks` y `getPortraitFallbacks` — construyen la cadena de URLs garantizando siempre al menos el default de sección.
- **Unit Tests:** `encyclopediaStore.test.ts` (9), `image-fallbacks.test.ts` (17), `ListView.test.tsx` (13), `ItemHeader.test.tsx` (22), `EncyclopediaImage.test.tsx` (10).
- **E2E Tests:** `encyclopedia.spec.ts` — 8 escenarios (ENC-01 a ENC-08) cubriendo navegación por pestañas, búsqueda, selección de items y vista de detalle.

---

## 📂 Estructura de Carpetas Clave

```
├── src/
│   ├── app/                   # Next.js App Router (routing + layouts)
│   ├── shared/                # Infraestructura sin lógica de negocio
│   │   ├── api/               # StorageService, Campaign interface
│   │   ├── config/            # clerk-theme, routes/auth
│   │   ├── lib/               # supabase, storage
│   │   ├── schemas/           # Zod schemas genéricos (storage)
│   │   ├── ui/                # ImageUploader, MysticBackground (barrel: index.ts)
│   │   └── utils/             # cn()
│   ├── views/                 # Feature slices (FSD)
│   │   ├── campaigns/
│   │   │   ├── api/           # campaign-actions.ts, campaign-queries.ts
│   │   │   ├── config/        # campaign-steps.ts
│   │   │   ├── lib/           # useCampaignForm.ts, notifications.ts
│   │   │   ├── model/         # campaign.ts, campaignStore.ts
│   │   │   ├── ui/            # creation/ (form, provider, controls)
│   │   │   └── index.ts       # Public API del slice
│   │   ├── encyclopedia/
│   │   │   ├── api/           # encyclopedia-queries.ts
│   │   │   ├── config/        # stats.ts
│   │   │   ├── lib/           # image-fallbacks.ts
│   │   │   ├── model/         # types.ts, encyclopediaStore.ts
│   │   │   ├── ui/            # SideTabs, ListView, DetailView, EncyclopediaImage…
│   │   │   └── index.ts       # Public API del slice
│   │   └── portal/
│   │       ├── lib/           # carousel-utils.ts, use-carousel.ts
│   │       ├── ui/            # Portal, PortalCard, PortalCarousel
│   │       └── index.ts       # Public API del slice
│   └── middleware.ts          # Middleware de rutas (Clerk, requerido por Next.js)
├── tests/
│   ├── artifacts/             # Resultados y trazas de Playwright
│   ├── e2e/                   # Tests Playwright
│   └── features/              # Tests Unitarios e Integración por funcionalidad
└── prisma/                    # Schema (fuente de verdad) + migraciones SQL
```

> 📁 Para la estructura detallada de carpetas del proyecto, ver [README.md](README.md#arquitectura-feature-sliced-design-fsd).

---

## 📍 Estado Actual

**Milestone:** M3: La Forja de la Enciclopedia (Datos, Imágenes y Estructuras)
**Tarea completada:** M3-02: Hub de la Enciclopedia y Navegación + Control de acceso público/privado de campañas
**En curso:** M3-03: Bestiario y Fichas de Monstruos

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
  - _Tareas:_
    1. ✅ Instalar `svix`.
    2. ✅ Configurar `CLERK_WEBHOOK_SECRET` en `.env`.
    3. ✅ Crear Route Handler (`api/webhooks/clerk`) con validación de firma.
    4. ✅ Implementar lógica de Prisma para `user.created`, `user.updated`, `user.deleted`.
    5. ✅ Testear localmente con ngrok y Dashboard de Clerk.
  - _AC:_ ✅ Los eventos de Clerk (`user.deleted` con cascada, `user.updated` con sync) son procesados correctamente vía svix con validación de firma.

### M2: El Salón de los Portales (Gestión de Campañas) [COMPLETADO]

- [x] **M2-01: Dashboard de Campañas (Vista Máster)**
  - _Tarea:_ Conectar `PortalCarousel` a datos reales de Prisma e implementar estado de "Vacío".
  - _AC:_ ✅ El DM ve sus campañas en el carrusel al entrar al dashboard; si no tiene ninguna, aparece el estado vacío.
- [x] **M2-02: Formulario de Creación de Aventuras**
  - _Tarea:_ Wizard multi-paso con React Hook Form + Zustand + Framer Motion (LazyLoad) para crear campañas vinculadas al usuario.
  - _AC:_ ✅ El DM puede completar el wizard, y al finalizar la campaña se crea en DB, se redirige automáticamente y aparece una toast de confirmación.
- [x] **M2-03: Testing de la Creación de Campañas**
  - _Tareas:_
    1. ✅ Migrar de Jest a Vitest 4.x (`vitest.config.ts` + `vitest.setup.ts`).
    2. ✅ Inicializar Playwright con proyecto `setup` de auth y proyecto `chromium`.
    3. ✅ Actualizar README (EN + ES) con estrategia de testing y variables de entorno necesarias.
  - _AC 1:_ ✅ El proyecto no tiene dependencias de Jest; Vitest está configurado y 12/12 tests pasan (`npm run test`, `npm run test:run` operativos).
  - _AC 2:_ ✅ Playwright está inicializado; los scripts `npm run test:e2e` y `npm run test:e2e:ui` son operativos.
  - _AC 3.1:_ ✅ Test de integración: `FormProvider` envuelve correctamente los inputs del formulario.
  - _AC 3.2:_ ✅ Test de integración: el error de validación es visible y el store no avanza si el nombre está vacío.
  - _AC 3.3:_ ✅ Test de integración: `createCampaign` es llamada con los datos correctos al hacer submit en el último paso.
  - _AC 4.1:_ ✅ E2E: carga de la Home pública + renderizado del `region` del Portal de Piedra en `/campaigns`.
  - _AC 4.2:_ ✅ E2E: navegación con botones Next/Prev y teclas ←→ del carrusel.
  - _AC 4.3:_ ✅ E2E: flujo completo Dot → Portal "Nueva Aventura" → Wizard (nombre + location) → redirect a `/campaigns/{id}` → campaña visible en el carrusel.
  - _Nota:_ Los tests E2E requieren `E2E_CLERK_USER_EMAIL` en `.env` (usuario existente en Clerk + lazy sync hecho).

### M3: La Forja de la Enciclopedia (Datos, Imágenes y Estructuras) [EN PROGRESO]

- [x] **A02: Refactorización del ORM — Prisma como única fuente de verdad** [COMPLETADO]
  - _Objetivo:_ Unificar el acceso a datos usando Prisma Client como ORM de runtime (server actions), eliminando el cliente Supabase JS de la capa de datos.
  - _Cambios realizados:_
    - ✅ `campaign-queries.ts`, `campaign-mutations.ts`, `encyclopedia-queries.ts`, `auth-sync.tsx`, `webhooks/clerk/route.ts`: todos usan `prisma` de `@/shared/lib/prisma`.
    - ✅ `campaign-hooks.ts`: normaliza `null → undefined` en query keys (Clerk devuelve `null`, TanStack Query requiere `undefined` para consistencia con el prefetch SSR).
    - ✅ `prefetchCampaignDetail`: recibe `userId` y lo propaga a la query para correcta hidratación.
    - ✅ `getCampaignById`: fix de seguridad — el OR de `gameMaster` solo se añade si `clerkId` tiene valor (evita que Prisma ignore la condición y exponga campañas privadas).
    - ✅ `[id]/page.tsx`: obtiene `userId` en paralelo con `params` via `Promise.all([auth(), params])`; campañas públicas accesibles sin login, privadas devuelven 404 para no autorizados.
    - ✅ `@prisma/adapter-pg` y `pg` eliminados del runtime.
    - ✅ `build` script: `prisma generate && next build` para que Vercel regenere tipos en CI.
  - _AC:_ ✅ `schema.prisma` es la única fuente de verdad: tipos TypeScript (via `prisma generate`) + migraciones SQL (via CLI) + queries de runtime (via Prisma Client).

- [x] **M3-00: Infraestructura de Imágenes (Storage)**
  - _Tareas:_
    1. ✅ Bucket `questlog-assets` creado en Supabase (Público).
    2. ✅ Políticas RLS configuradas (SELECT: anon, INSERT/UPDATE/DELETE: owner).
    3. ✅ `next.config.ts` actualizado con `remotePatterns` para el hostname de Supabase.
    4. ✅ Componente `ImageUploader` atomizado y funcional (validación 2MB, preview, upload).
    5. ✅ Estética de "Lienzo de dibujo" implementada con esquinas decorativas dinámicas.
  - _Cobertura de Tests:_ ✅ Esquema (unit), Servicio (integración), Hook (lógica de estado) y Componente (UI). Estructura organizada por features en `/tests`.
  - _AC 1:_ ✅ Puedo subir una imagen desde `ImageUploader` — selección, validación (2MB / tipo MIME) y envío vía `StorageService.uploadFile` funcionan correctamente.
  - _AC 2:_ ✅ El componente devuelve una URL pública (`onUpload: (url: string) => void`) que puede guardarse en `Campaign.imageUrl`. `createCampaign` y `updateCampaign` aceptan `imageUrl` en su DTO.

- [x] **M3-01: Reestructuración de Datos (Atómicos vs JSON)** [COMPLETADO]
  - _Objetivo:_ Eliminar campos `Json` de estadísticas para permitir filtrado y búsquedas eficientes en DB.
  - _Tareas (Cambios Prisma):_
    - ✅ Modelos `MonsterTemplate`, `ActiveMonster`, `CharacterTemplate`, `Character`: Eliminado `stats` JSON → Agregadas columnas `strength`, `dexterity`, `constitution`, `intelligence`, `wisdom`, `charisma`, `ac`, `speed`, `initiativeBonus`, `perception`.
    - ✅ Estandarización de `maxHp` y `currentHp`.
    - ✅ Tabla `Item`: Añadido `templateId`, `rarity` migrado a Enum.
    - ✅ Nuevas Tablas: `ItemTemplate`, `AccessGrant` (Permisos compartidos), Enums (`Rarity`, `AccessType`).
    - ✅ `Campaign`: Añadido `parentCampaignId` e `imageUrl`.
    - ✅ Documentación del schema (`docs/DATABASE_SCHEMA.md` ES + `docs/DATABASE_SCHEMA.en.md` EN).
  - _AC 1:_ ✅ No existen campos de tipo `Json` para estadísticas en el schema de Prisma.
  - _AC 2:_ ✅ Es posible filtrar entidades por stats individuales (ej. `strength > 15`) directamente en una query de Prisma.
  - _AC 3:_ ✅ La migración se aplica en el entorno de desarrollo sin pérdida de datos existentes.

- [x] **M3-02: Hub de la Enciclopedia y Navegación** [COMPLETADO]
  - _Tarea:_ Crear página `/encyclopedia` con pestañas (Bestiario, Elenco, Museo) y filtros (Mis Creaciones | Públicos | Compartidos).
  - _Avance:_
    - ✅ Página `/encyclopedia` creada con datos reales de Supabase.
    - ✅ Navegación por pestañas (`SideTabs`) con tres secciones: Bestiario, Elenco, Museo.
    - ✅ `ListView` con búsqueda local y selección de item.
    - ✅ `DetailView` animado con imagen, stats y fallback a imagen por defecto según sección.
    - ✅ State management con Zustand (`encyclopediaStore`) + selectores granulares.
    - ✅ Cadena de fallback de imágenes (`imageUrl` → `portraitImageUrl` → default por sección).
    - ✅ Indicador visual `OctagonAlert` en la imagen principal y en el retrato cuando la URL está vacía o falla.
    - ✅ `DetailView` eleva estado `imageMissing` desde `EncyclopediaImage` hacia `ItemHeader` para mostrar indicador en el label de sección (museo).
    - ✅ Suite completa de tests unitarios: `encyclopediaStore` (9), `image-fallbacks` (17), `ListView` (13), `ItemHeader` (22), `EncyclopediaImage` (10).
    - ✅ Suite E2E: `encyclopedia.spec.ts` — 8 escenarios pasando (ENC-01 a ENC-08), 1 skip intencional (ENC-06 requiere 2+ items).
    - ⏳ Filtros (Mis Creaciones | Públicos | Compartidos): pendiente para próximo milestone.
  - _AC:_ ✅ El usuario puede navegar a `/encyclopedia`, cambiar entre las tres pestañas y ver detalle de cada item. Los items con imagen rota o sin URL muestran el indicador `OctagonAlert`.

- [ ] **M3-03: Bestiario y Fichas de Monstruos**
  - _Tarea:_ Formulario unificado para `MonsterTemplate` (Librería) y `ActiveMonster` (Instancia de Campaña) con stats atómicos y upload de imagen.
  - _AC:_ El DM puede crear y editar una ficha de monstruo con stats atómicos y asociarla a una campaña; la imagen se sube y se muestra correctamente.

- [ ] **M3-04: Módulo de Inventario y Museo**
  - _Tarea:_ CRUD de objetos con visualización temática según rareza y gestión de posesión (Personaje vs Mundo).
  - _AC:_ El DM puede crear, editar y eliminar objetos; la rareza se refleja visualmente y la posesión (Personaje o Mundo) es asignable.

- [ ] **M3-05: Registro de Personajes (Template & Instance)**
  - _Tarea:_ Gestión de NPCs y Héroes con stats completos, nivel y vinculación de inventario inicial.
  - _AC:_ El DM puede crear personajes/NPCs con stats atómicos, vincularlos a una campaña y asignarles un inventario inicial.

### M4: Las Crónicas del Coliseo (Live Tools) [PENDIENTE]

- [ ] **M4-01: Logbook de Sesión**
  - _Tarea:_ Diario de campaña con persistencia y cronología.
  - _AC:_ El DM puede añadir entradas al diario de una campaña y verlas ordenadas cronológicamente en sesiones posteriores.
- [ ] **M4-02: Gestor de Iniciativa (El Coliseo)**
  - _Tarea:_ Herramienta de turnos para combate en vivo.
  - _AC:_ El DM puede añadir participantes, ordenarlos por iniciativa y avanzar turnos en tiempo real sin recargar la página.
- [ ] **M4-03: Pulido y Despliegue**
  - _Tarea:_ Optimización UI/UX y deploy en Vercel.
  - _AC:_ La aplicación pasa un audit de Lighthouse (Performance ≥ 90) y está desplegada y accesible en producción.

---

## 🛠️ Notas de Ingeniería (Compound Context)

- **Tech Stack:** Next.js (App Router), Prisma Client (ORM runtime — queries + mutations), Supabase (PostgreSQL host + Storage), Clerk, Tailwind.
- **Arquitectura Frontend:** Feature-Sliced Design (FSD) — capas `app/`, `views/` (slices con `api/`, `model/`, `ui/`), `shared/`. Cada slice expone su Public API a través de `index.ts` raiz. `app/` solo importa desde esos barrels.
- **UI Estilo:** Gamificada, texturas de piedra, portales mágicos.
- **Principio:** No se avanza de Issue hasta cumplir todos sus AC (Criterios de Aceptación).
- **Testing de Base de Datos:** Se ha creado un script `prisma/seed.ts` para poblar la base de datos con datos de prueba (mock data) vinculados a un usuario real de desarrollo.
  - **Configuración:** Requiere definir `SEED_USER_EMAIL` en `.env`.
  - **Uso:** Primero inicia sesión en la app para que el usuario se sincronice en la DB. Luego ejecuta `npm run db:seed`.
  - **Resultado:** Borra campañas anteriores de ese usuario y crea nuevas campañas y personajes de prueba.

---

## 📝 Siguientes Pasos Inmediatos

1. **M3-03: Bestiario y Fichas de Monstruos**

2. **M3-04: Módulo de Inventario y Museo**

3. **M3-05: Registro de Personajes (Template & Instance)**

4. **M3-02: Filtros de la Enciclopedia** (backlog menor)
   - Implementar filtros: Mis Creaciones | Públicos | Compartidos.

---

## 🏗️ Principios Aprendidos / Refactorizaciones

- **Feature-Sliced Design (FSD):** Organizar el código por slices de feature (`views/campaigns/`, `views/encyclopedia/`, `views/portal/`) con segmentos `api/`, `model/`, `ui/` dentro de cada uno. Cada slice expone un `index.ts` como Public API — `app/` nunca importa internos de un slice directamente. El código de dominio (notificaciones de campaña, pasos del wizard) vive en `views/<slice>/lib/` o `views/<slice>/config/`, no en `shared/`. `shared/` es únicamente infraestructura genérica sin lógica de negocio.
- **Normalización null→undefined en hooks:** Clerk devuelve `null` cuando no hay sesión; TanStack Query usa `undefined` en las query keys del prefetch SSR. El mismatch provoca que la hidratación no encuentre los datos cacheados y dispara un refetch que causa el error de timing `'CampaignPage' cannot have a negative time stamp` en Turbopack. Solución: `rawUserId ?? undefined` en todos los hooks que consumen `useAuth()`.
- **Compound Components & Estado:** Evitar _prop-drilling_ usando `FormProvider` y extrayendo lógicas visuales de navegación de interfaces animadas hacia **Zustand**. Esto facilita aislar el DOM que maneja tags ruidosos como `<form>` y concentrar el _submit_ lejos de los mapeos visuales.
- **Micro-Interactividad:** Integrar un `isTransitioning` lock en los formularios multicapa para evitar que el usuario de doble-clic y colapse el árbol reactivo durante las animaciones de Framer Motion.
- **Optimización de Bundle:** Mover `motion` a `<LazyMotion features={domAnimation}>` y `m.div` en UI cargadas globalmente para ahorrar severos picos de ~30kb en renderizados iniciales.
- **Accesibilidad:** No utilizar `autoFocus` nativo en componentes renderizados condicionalmente ya que rompe el flujo interpretativo de los screen-readers.
- **Secuencialidad vs Paralelismo:** Promesas que no dependen una de otra como llamadas a `auth()` y extracción de `params` asincrónicos o DB, agruparlas de forma segura en un `Promise.all()`.
- **Arquitectura de Animaciones (LazyMotion):** Se ha implementado `LazyMotion` global con el paquete `domAnimation`. Esto reduce el bundle en ~30kb al excluir funciones pesadas de Framer Motion (como `drag` físico o `layout animations`) que no son necesarias para la mayoría de la UI.
- **Drag & Drop Híbrido:** La funcionalidad de arrastrar archivos en `ImageUploader` sigue operativa porque utiliza la **API nativa de HTML5** (`onDrop`, `onDragOver`), delegando en Framer Motion solo el "feedback visual" (escalado, opacidad). Esto combina la robustez del navegador con la fluidez de las animaciones optimizadas.
