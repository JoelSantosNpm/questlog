# QuestLog - RPG Campaign Manager

[🇺🇸 English](README.md) | [🇪🇸 Español](README.es.md)

> **Status:** Active development. See [PROJECT_STATE.md](PROJECT_STATE.md) for the current milestone progress.

**QuestLog** is a Grimdark-themed web application for Dungeon Masters to manage their D&D 5e campaigns. It provides tools for tracking narrative progression, inventory, bestiary, and combat encounters.

## 🚀 Features

- **The Portal**: 3D circular carousel for campaign navigation.
- **Authentication (Clerk)**: Secure sign-in/sign-up with automatic user sync to the database.
- **Session Notes (El Cronicón)**: Chronological session diary.
- **Inventory System (El Almacén)**: Loot, items, rarities, and quantities.
- **Bestiary & Combat Tracker (El Coliseo)**: Monster library + live initiative tracker.

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Auth**: [Clerk](https://clerk.com/) + [`@clerk/nextjs`](https://www.npmjs.com/package/@clerk/nextjs)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/) with `@prisma/adapter-pg`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Jest](https://jestjs.io/) + Testing Library

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- A [Supabase](https://supabase.com/) project (PostgreSQL)
- A [Clerk](https://clerk.com/) application

## 🏁 Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   cd questlog
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Create a `.env` file in the root directory with the following variables:

   ```env
   # Supabase / Prisma
   DATABASE_URL_REMOTE="postgresql://user:password@host:port/database"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
   CLERK_SECRET_KEY="sk_..."
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   ```

4. **Database Setup:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
src/
├── app/                        # Routes and pages (App Router)
│   ├── components/portal/      # 3D Carousel
│   ├── providers/              # ClerkProvider wrapper
│   ├── sign-in/ & sign-up/     # Auth pages
│   └── layout.tsx              # Root layout (includes AuthSync)
├── components/auth/
│   └── auth-sync.tsx           # Lazy Sync: Clerk → Prisma
├── config/
│   ├── clerk-theme.ts          # Custom Grimdark Clerk theme
│   └── routes/auth.ts          # Public/protected route constants
├── lib/
│   └── prisma.ts               # Prisma singleton with PrismaPg adapter
├── hooks/ui/                   # Generic UI hooks (useCarousel)
├── types/                      # Shared TypeScript types
prisma/
│   └── schema.prisma           # DB schema
└── src/proxy.ts                # Route protection middleware
```

## 📜 Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |
| `npm test`      | Run unit tests           |

## 🔒 Private Project

This is a private project. Not open for contributions at this time.
