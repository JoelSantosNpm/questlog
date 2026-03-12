# QuestLog - Gestor de Campañas RPG

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

> **Estado:** En desarrollo activo. Consulta [PROJECT_STATE.md](PROJECT_STATE.md) para ver el progreso del milestone actual.

**QuestLog** es una aplicación web de estética Grimdark para que los Dungeon Masters gestionen sus campañas de D&D 5e. Ofrece herramientas para el seguimiento narrativo, inventarios, bestiario y combates en tiempo real.

## �️ Modelo de Datos y Relaciones

El esquema de base de datos (`prisma/schema.prisma`) define la estructura central de QuestLog. A continuación, se detallan las tablas principales y sus comportamientos de **integridad referencial (Cascada / SetNull)**.

### Tablas Principales

1.  **User**: Representa a un usuario registrado (Vía Clerk).
    - `id`, `clerkId`, `email`, `name`, `image`, `plan`.
    - Puede ser **Game Master (GM)** de múltiples campañas.
    - Puede ser **Jugador** con múltiples personajes.
    - Puede ser **Creador** de plantillas de personajes.

2.  **Campaign**: La mesa de juego.
    - Pertenece a un GM (`User`).
    - Contiene Notas de Sesión, Monstruos Activos y Personajes vinculados.
    - Relación de borrado en cascada con el usuario creador.

3.  **Character**: El aventurero.
    - Pertenece a un Jugador (`User`).
    - Puede estar asignado a una Campaña (`Campaign`) o ser independiente.
    - Puede basarse en una Plantilla (`CharacterTemplate`).
    - Posee atributos propios (`currentHp`, `maxHp`, `stats`, `level`) y un Inventario (`Item[]`).

4.  **CharacterTemplate**: Plantilla base para crear personajes (preparado para Marketplace).
    - Define `baseStats`, `suggestedEquipment`, `price`, `version`.

5.  **Item**: Objetos del inventario.
    - Detalles completos: `rarity`, `type`, `weight`, `value`, `image`, `quantity`.
    - Estado: `equipped`, `attuned`, `notes`.

6.  **Monster / ActiveMonster**:
    - `Monster`: Definición base de una criatura (`stats`, `abilities`, `challenge`).
    - `ActiveMonster`: Instancia viva en una campaña (`currentHp`, `initiative`, `status`).

### Comportamiento de Borrado en Cascada (Cascade Delete)

El sistema implementa estrategias de borrado para mantener la consistencia de datos y evitar huérfanos no deseados, pero preservando lo importante:

| Si borras...            | Se borra automáticamente (Cascade)                    | Se desvincula (SetNull - Sobrevive)                                                   |
| :---------------------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------ |
| **User (GM/Jugador)**   | Sus Campañas, sus Personajes, sus Plantillas creadas. | -                                                                                     |
| **Campaign**            | Notas de Sesión, Monstruos Activos en esa campaña.    | **Los Personajes** (Se mantienen vivos pero sin campaña asignada).                    |
| **Character**           | Su Inventario (Items).                                | -                                                                                     |
| **CharacterTemplate**   | -                                                     | **Los Personajes** creados con esa plantilla.                                         |
| **Monster (Bestiario)** | -                                                     | **Los Monstruos Activos** (Se mantienen en la campaña pero pierden la ref. original). |

> **Nota importante:** Si un GM borra una campaña, los personajes de los jugadores **NO se borran**. Simplemente, quedan "libres" y el jugador conserva su hoja de personaje.

## �🚀 Características Principales

- **El Portal**: Carrusel 3D circular para navegar entre campañas.
- **Autenticación (Clerk)**: Login/registro seguro con sincronización automática de usuario a base de datos.
- **El Cronicón**: Bitácora cronológica de notas de sesión.
- **El Almacén**: Control de botín, objetos, rarezas y cantidades.
- **El Coliseo**: Biblioteca de monstruos + rastreador de iniciativa en vivo.

## 🛠 Stack Tecnológico

- **Frontend**:
  - [Next.js 16](https://nextjs.org/) (App Router, Server Components)
  - [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
  - [Zustand](https://zustand-demo.pmnd.rs/) & [React Hook Form](https://react-hook-form.com/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Framer Motion](https://www.framer.com/motion/)

- **Autenticación**:
  - [Clerk](https://clerk.com/) + [`@clerk/nextjs`](https://www.npmjs.com/package/@clerk/nextjs)

- **Backend & Datos**:
  - [PostgreSQL](https://www.postgresql.org/) vía [Supabase](https://supabase.com/)
  - [Prisma ORM](https://www.prisma.io/) con `@prisma/adapter-pg`

- **Calidad de Código**:
  - [Jest](https://jestjs.io/) + Testing Library
  - ESLint

## 📦 Requisitos Previos

- [Node.js](https://nodejs.org/) v18 o superior
- Un proyecto en [Supabase](https://supabase.com/) (PostgreSQL)
- Una aplicación en [Clerk](https://clerk.com/)

## 🏁 Instalación y Desarrollo

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   cd questlog
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno:**

   Crea un archivo `.env` en la raíz con las siguientes variables:

   ```env
   # Supabase / Prisma
   DATABASE_URL_REMOTE="postgresql://usuario:contraseña@host:puerto/base_de_datos"

   # Clerk Autenticación
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

   # Seeding de Base de Datos (Opcional)
   SEED_GM_EMAIL="tu-email-de-gm@ejemplo.com"
   SEED_PLAYER_EMAIL="tu-email-de-player@ejemplo.com"
   ```

4. **Inicializar Base de Datos:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lanzar Servidor de Desarrollo:**

   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🧪 Desarrollo y Datos de Prueba (Seeding)

Dado que este proyecto utiliza Clerk para la autenticación, poblar la base de datos requiere vincular datos de prueba a usuarios reales de Clerk.

1.  Añade los emails de tus usuarios de desarrollo (GM y Jugador) al archivo `.env`:

    ```env
    SEED_GM_EMAIL=tu-email-de-gm@ejemplo.com
    SEED_PLAYER_EMAIL=tu-email-de-player@ejemplo.com
    ```

    _Nota: Pueden ser el mismo email si quieres que un solo usuario tenga ambos roles._

2.  Ejecuta la aplicación (`npm run dev`) e inicia sesión con esos emails para asegurar que los registros de usuario existan en la base de datos (se crean al loguearse).
3.  Ejecuta el script de seed:
    ```bash
    npm run db:seed
    ```
    Esto poblará la base de datos con una campaña de prueba donde el usuario definido en `SEED_GM_EMAIL` será el Master, y `SEED_PLAYER_EMAIL` tendrá un personaje asignado.

### Pruebas de Integridad (Borrado en Cascada)

Para verificar que las reglas de borrado (Cascade vs SetNull) funcionan correctamente y proteger la integridad de los datos de los jugadores, puedes ejecutar el script de prueba:

```bash
npx tsx --env-file=.env prisma/test-cascade.ts
```

Este script simula varios escenarios críticos y genera logs detallados:

1.  **Borrado de Campaña**: Verifica que los personajes vinculados **sobrevivan** (SetNull), aunque las notas y monstruos se eliminen.
2.  **Borrado de Jugador**: Verifica que si un usuario se da de baja, su personaje e inventario **se eliminen** (Cascade).
3.  **Borrado de GM**: Verifica que si un GM elimina su cuenta, sus campañas desaparezcan, pero los personajes de _otros jugadores_ en esas mesas **sobrevivan**.

## 📂 Estructura del Proyecto

```
src/
├── app/                        # Rutas y páginas (App Router)
│   ├── components/portal/      # Carrusel 3D
│   ├── providers/              # Wrapper de ClerkProvider
│   ├── sign-in/ & sign-up/     # Páginas de autenticación
│   └── layout.tsx              # Root layout (incluye AuthSync)
├── components/auth/
│   └── auth-sync.tsx           # Lazy Sync: Clerk → Prisma
├── config/
│   ├── clerk-theme.ts          # Tema Grimdark personalizado para Clerk
│   └── routes/auth.ts          # Constantes de rutas públicas/protegidas
├── lib/
│   └── prisma.ts               # Singleton de Prisma con adaptador PrismaPg
├── hooks/ui/                   # Hooks genéricos (useCarousel)
├── types/                      # Tipos TypeScript compartidos
prisma/
│   └── schema.prisma           # Esquema de la BD
└── src/proxy.ts                # Middleware de protección de rutas
```

## 📜 Scripts

| Comando         | Descripción                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Inicia el servidor de desarrollo |
| `npm run build` | Construye para producción        |
| `npm run start` | Inicia el servidor de producción |
| `npm run lint`  | Ejecuta ESLint                   |
| `npm test`      | Ejecuta los tests unitarios      |

## 🔒 Proyecto Privado

Este es un proyecto privado. No está abierto a contribuciones en este momento.
Todos los derechos reservados.
