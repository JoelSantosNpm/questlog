# ⚔️ QuestLog - Gestor de Campañas RPG

[🇺🇸 English](README.md) | **🇪🇸 Español**

> **Estado:** En desarrollo activo. Consulta [PROJECT_STATE.md](PROJECT_STATE.md) para ver el progreso detallado.

**QuestLog** es una plataforma diseñada para Dungeon Masters que buscan una gestión de campañas de D&D 5e inmersiva y eficiente. Bajo una estética _Grimdark_, ofrece herramientas para el seguimiento de la narrativa, gestión de inventarios, bestiario y un rastreador de combates en tiempo real.

---

## ⚔️ Zonas abiertas

- **El Portal de Piedra:** Carrusel circular 3D con perspectiva para navegar entre campañas, con soporte de teclado y animaciones inmersivas.
- **Autenticación (Clerk):** Registro e inicio de sesión seguros con sincronización automática de perfiles en la base de datos (_Lazy Sync_).
- **Creación de Aventuras:** Un _wizard_ animado multipaso que teje tus inputs en narrativa de campaña, impulsado por Zustand + React Hook Form + Framer Motion.
- **Hub de la Enciclopedia:** Base de conocimiento con tres pestañas (Bestiario, Elenco, Museo), vista de detalle animada y navegación por sección.

---

## 🔮 El Tomo Ilustrado

### El Portal de Piedra — Selección de Campaña

![El Portal de Piedra — Selección de Campaña](public/screenshots/campaign-portals.png)

> Navega tus campañas a través de un carrusel de portales de piedra en 3D

### Formulario de Creación de Aventura

![Formulario de Creación de Aventura](public/screenshots/campaign-creation.png)

> Un _wizard_ narrativo multipaso que convierte tus inputs en lore de campaña

---

## 🏗️ Arquitectura de Datos: El Corazón del Sistema

El sistema de datos de QuestLog ha evolucionado para priorizar el rendimiento en consultas complejas y la flexibilidad del DM.

### 🛡️ Estadísticas Atómicas y Consistencia

Se ha migrado de objetos JSON a **columnas atómicas** en la base de datos. Esto no es solo un cambio técnico; es lo que permite que el buscador de la "Enciclopedia" funcione al instante y que los cálculos de combate (CA, Modificadores) sean precisos y reactivos.

### 🧬 Plantillas vs Instancias (El "Molde" y la "Figura")

Para maximizar la reutilización, QuestLog separa la definición de un ser de su presencia en la mesa:

- **Plantillas (`MonsterTemplate`, `ItemTemplate`):** Son las reglas base definidas en los manuales.
- **Instancias (`ActiveMonster`, `Item`):** Son los elementos vivos que sufren daño, se equipan o se gastan en una sesión específica.

> 📖 **Para una explicación técnica profunda sobre relaciones y borrado en cascada, consulta la [Guía del Esquema de Datos](docs/DATABASE_SCHEMA.md).**

---

## 🛠️ Stack Tecnológico: ¿Por qué estas herramientas?

Cada pieza del stack ha sido elegida para cumplir un propósito específico en la experiencia del usuario:

### Frontend (Inmersión y Reactividad)

- **[Next.js 16](https://nextjs.org/) (App Router):** La base para una navegación rápida y optimización de SEO/Performance mediante Server Components.
- **[React Compiler](https://react.dev/learn/react-compiler):** Aprovechamos la memoización automática para mantener una UI fluida sin la sobrecarga mental de `useMemo` o `useCallback`.
- **[Zustand](https://docs.pmnd.rs/zustand/):** Gestiona el estado de flujos complejos, como el _wizard_ multipaso de creación de campañas, manteniendo la lógica fuera de los componentes.
- **[Framer Motion](https://www.framer.com/motion/):** Aporta la capa de interactividad y animaciones "mágicas" (como el carrusel 3D de portales) que definen la estética de la app.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Estilado ultra-rápido con variables CSS nativas.

### Backend e Infraestructura (Robustez)

- **[Supabase (PostgreSQL)](https://supabase.com/):** Base de datos relacional potente para manejar las complejas redes de misiones, personajes e ítems. El cliente `@supabase/supabase-js` se usa directamente para todas las consultas del servidor, sin necesidad de una capa ORM adicional.
- **[Clerk](https://clerk.com/):** Autenticación de nivel profesional con sincronización automática de perfiles.

---

## 🏁 Instalación y Desarrollo

1. **Clonar e Instalar:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   npm install
   ```

2. **Variables de Env:** Crea un archivo `.env` con las siguientes claves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   CLERK_WEBHOOK_SECRET=
   ```
3. **Base de Datos:** Aplica las migraciones SQL de `prisma/migrations/` desde el SQL Editor de Supabase, o usa la CLI:
   ```bash
   supabase db push
   ```
4. **Lanzar Servidor:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🧪 Desarrollo y Datos de Prueba (Seeding)

Dado que este proyecto utiliza Clerk para la autenticación, poblar la base de datos requiere vincular datos de prueba a usuarios reales de Clerk.

1.  **Configura tus correos:** Añade los emails de tus usuarios de desarrollo (GM y Jugador) al archivo `.env`:
    ```env
    SEED_GM_EMAIL=tu-email-de-gm@ejemplo.com
    SEED_PLAYER_EMAIL=tu-email-de-jugador@ejemplo.com
    ```
2.  **Sincronización:** Ejecuta la aplicación (`npm run dev`) e inicia sesión con esos emails para asegurar que los registros de usuario existan en la base de datos (se crean automáticamente al loguearse via _Lazy Sync_).
3.  **Ejecución:** Lanza el script de seed:
    ```bash
    npm run db:seed
    ```
    Esto poblará la base de datos con una campaña de prueba (_La Maldición de Strahd_) donde el usuario de GM será el Master y el Jugador tendrá un personaje asignado.

---

## 🧪 Estrategia de Testing

Mantenemos una suite de pruebas en dos capas para asegurar que la "mesa de juego" nunca se rompa:

| Capa                       | Herramienta                | Ámbito                                                                          | Comando            |
| :------------------------- | :------------------------- | :------------------------------------------------------------------------------ | :----------------- |
| **Unitario e Integración** | Vitest 4 + Testing Library | Utils puras, Zustand store, componentes React con server actions mockeadas      | `npm run test:run` |
| **End-to-End**             | Playwright (Chromium)      | Flujos reales en navegador: carrusel del Portal + wizard de creación de campaña | `npm run test:e2e` |

### Comandos de Test

```bash
npm run test          # Vitest en modo watch (desarrollo)
npm run test:run      # Vitest pasada única (CI)
npm run test:coverage # Vitest con informe de cobertura v8
npm run test:e2e      # Playwright E2E (headless)
npm run test:e2e:ui   # Playwright E2E con interfaz interactiva
```

### Ejecutar los tests E2E

Los tests E2E necesitan la app corriendo y una variable de entorno adicional:

```env
# .env — necesario para la autenticación en Playwright via @clerk/testing
E2E_CLERK_USER_EMAIL=tu-usuario-de-prueba@ejemplo.com
```

El usuario debe existir en Clerk y haber iniciado sesión en la app al menos una vez para sincronizar su registro.

### Integridad de Datos (Borrado en Cascada)

Las reglas de borrado (_Cascade vs SetNull_) están definidas a nivel de base de datos en los archivos SQL de `prisma/migrations/`. Consulta la [Guía del Esquema de Datos](docs/DATABASE_SCHEMA.md) para el desglose completo.

---

## 📂 Estructura del Proyecto

```
src/
├── app/                        # Rutas y páginas (App Router)
│   ├── campaigns/              # Páginas de campaña
│   │   ├── page.tsx            # Carrusel del Portal (selección de campaña)
│   │   ├── creation/           # Formulario de creación de campaña
│   │   └── [id]/               # Detalle de campaña
│   ├── colosseum/              # Rastreador de combate (El Coliseo)
│   ├── dashboard/              # Dashboard principal
│   ├── sign-in/ & sign-up/     # Páginas de autenticación
│   └── layout.tsx              # Layout raíz (incluye AuthSync)
├── actions/
│   └── campaign-actions.ts     # Server Actions (crear campaña, etc.)
├── components/
│   ├── auth/
│   │   └── auth-sync.tsx       # Sincronización perezosa: Clerk → Supabase
│   ├── campaigns/creation/     # Formulario multipaso de creación de campaña
│   │   ├── CampaignCreationProvider.tsx  # Raíz de contexto RHF + Zustand
│   │   ├── CampaignCreationForm.tsx      # Formulario narrativo animado
│   │   ├── StepControls.tsx             # Botones de paso Siguiente/Saltar/Enviar
│   │   ├── hooks/useCampaignForm.ts      # Lógica de formulario y pasos
│   │   └── store/campaignStore.ts        # Estado de pasos en Zustand
│   ├── portal/                 # Componentes del carrusel 3D
│   └── shared/ui/              # Componentes UI reutilizables
├── config/
│   ├── campaign-steps.ts       # Definiciones de pasos para la creación de campaña
│   ├── clerk-theme.ts          # Tema personalizado Grimdark para Clerk
│   └── routes/auth.ts          # Constantes de rutas públicas/protegidas
├── data/
│   ├── campaign-queries.ts     # Consultas de lectura Supabase (campañas)
│   └── encyclopedia-queries.ts # Consultas de lectura Supabase (bestiario, ítems, personajes)
├── lib/
│   ├── supabase/               # Factory del cliente Supabase (server + client)
│   └── notifications.ts        # Ayudantes para notificaciones toast
├── hooks/ui/                   # Hooks genéricos de UI (useCarousel)
├── providers/                  # Proveedores a nivel de app (AuthProvider)
└── types/                      # Tipos TypeScript compartidos
prisma/
├── schema.prisma               # Esquema de la base de datos (fuente de verdad estructural)
├── seed.ts                     # Script de seeding de la base de datos
└── migrations/                 # Historial de migraciones SQL
src/proxy.ts                    # Middleware de protección de rutas
```

## 📜 Scripts

| Comando                        | Descripción                        |
| ------------------------------ | ---------------------------------- |
| `npm run dev`                  | Inicia el servidor de desarrollo   |
| `npm run build`                | Construye para producción          |
| `npm run start`                | Inicia el servidor de producción   |
| `npm run lint`                 | Ejecuta ESLint                     |
| `npm test`                     | Ejecuta los tests unitarios        |
| `npm run db:seed`              | Puebla la base de datos (Seed)     |
| `npx -y react-doctor@latest .` | Audita la salud del proyecto React |

## 🔒 Proyecto Privado

Este es un proyecto privado. No está abierto a contribuciones en este momento.
Todos los derechos reservados.
