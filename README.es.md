# QuestLog - Gestor de Campañas RPG

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

> **Estado:** En desarrollo activo. Consulta [PROJECT_STATE.md](PROJECT_STATE.md) para ver el progreso del milestone actual.

**QuestLog** es una aplicación web de estética Grimdark para que los Dungeon Masters gestionen sus campañas de D&D 5e. Ofrece herramientas para el seguimiento narrativo, inventarios, bestiario y combates en tiempo real.

## 🚀 Características Principales

- **El Portal**: Carrusel 3D circular para navegar entre campañas.
- **Autenticación (Clerk)**: Login/registro seguro con sincronización automática de usuario a base de datos.
- **El Cronicón**: Bitácora cronológica de notas de sesión.
- **El Almacén**: Control de botín, objetos, rarezas y cantidades.
- **El Coliseo**: Biblioteca de monstruos + rastreador de iniciativa en vivo.

## 🛠 Stack Tecnológico

- **Frontend**:
  - [Next.js 16](https://nextjs.org/) (App Router, Server Components)
  - [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
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
