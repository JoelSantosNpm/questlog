# ⚔️ QuestLog - RPG Campaign Manager

**🇺🇸 English** | [🇪🇸 Español](README.es.md)

> **Status:** Active development. See [PROJECT_STATE.md](PROJECT_STATE.md) for the current milestone progress.

**QuestLog** is a Grimdark-themed platform for Dungeon Masters seeking immersive and efficient D&D 5e campaign management. It provides tools for tracking narrative progression, inventory, bestiary, and live combat encounters.

---

## ⚔️ Open Zones

- **The Stone Portal:** 3D perspective circular carousel to navigate between campaigns, with keyboard support and immersive animations.
- **Authentication (Clerk):** Secure sign-in/sign-up with automatic profile sync to the database (_Lazy Sync_).
- **Adventure Creation:** An animated multi-step _wizard_ that weaves your inputs into campaign lore, powered by Zustand + React Hook Form + Framer Motion.
- **Encyclopedia Hub:** Three-tab knowledge base (Bestiary, Cast, Museum) with animated detail view and section-based navigation.

---

## 🔮 The Illustrated Tome

### The Stone Portal — Campaign Selection

![The Stone Portal — Campaign Selection](public/screenshots/campaign-portals.png)

> Navigate your campaigns through a 3D stone portal carousel

### Adventure Creation Form

![Adventure Creation Form](public/screenshots/campaign-creation.png)

> A narrative-driven multi-step wizard that turns your inputs into campaign lore

---

## 🧱 Architecture: Feature-Sliced Design (FSD)

The `src/` folder follows **FSD v2.1** with three canonical layers:

```
src/
├── app/                        # Routes and pages (App Router)
│   ├── campaigns/              # Campaign pages
│   │   ├── page.tsx            # Portal carousel (campaign selection)
│   │   ├── creation/           # Campaign creation form
│   │   └── [id]/               # Campaign detail
│   ├── colosseum/              # Combat tracker (El Coliseo)
│   ├── dashboard/              # Main dashboard
│   ├── encyclopedia/           # Encyclopedia hub
│   ├── sign-in/ & sign-up/     # Authentication pages
│   ├── auth/auth-sync.tsx      # Lazy sync: Clerk → Supabase
│   └── layout.tsx              # Root layout
├── views/                      # Feature slices (FSD)
│   ├── campaigns/
│   │   ├── api/                # campaign-actions.ts, campaign-queries.ts
│   │   ├── config/             # campaign-steps.ts
│   │   ├── lib/                # useCampaignForm.ts, notifications.ts
│   │   ├── model/              # campaign.ts, campaignStore.ts
│   │   ├── ui/creation/        # CampaignCreationForm, Provider, StepControls
│   │   └── index.ts            # Public API
│   ├── encyclopedia/
│   │   ├── api/                # encyclopedia-queries.ts
│   │   ├── config/             # stats.ts
│   │   ├── lib/                # image-fallbacks.ts
│   │   ├── model/              # types.ts, encyclopediaStore.ts
│   │   ├── ui/                 # SideTabs, ListView, DetailView, EncyclopediaImage,
│   │   │                       #   ItemHeader, PortraitFrame, CombatStats, ItemProperties…
│   │   └── index.ts            # Public API
│   └── portal/
│       ├── lib/                # carousel-utils.ts, use-carousel.ts
│       ├── ui/                 # Portal, PortalCard, PortalCarousel
│       └── index.ts            # Public API
├── shared/
│   ├── api/                    # StorageService, Campaign interface
│   ├── config/                 # Clerk theme, route constants
│   ├── lib/                    # Supabase clients, storage helpers
│   ├── schemas/                # Zod schemas (storage validation)
│   ├── ui/                     # ImageUploader, MysticBackground (barrel: index.ts)
│   └── utils/                  # cn()
prisma/
├── schema.prisma               # Database schema (source of truth for structure)
├── seed.ts                     # Database seeding script
└── migrations/                 # SQL migration history
src/middleware.ts               # Route protection (Clerk, required by Next.js)
```

---

## 🏗️ Data Architecture: The Heart of the System

QuestLog's data system has evolved to prioritize performance on complex queries and DM flexibility.

### 🛡️ Atomic Stats & Consistency

Stats have been migrated from JSON objects to **atomic columns** in the database. This isn't just a technical change — it's what makes the "Encyclopedia" search instant and combat calculations (AC, Modifiers) precise and reactive.

### 🧬 Templates vs Instances (The "Mold" and the "Figure")

To maximize reusability, QuestLog separates the definition of an entity from its presence at the table:

- **Templates (`MonsterTemplate`, `ItemTemplate`):** The base rules defined in the manuals.
- **Instances (`ActiveMonster`, `Item`):** The living elements that take damage, get equipped, or are consumed in a specific session.

> 📖 **For a deep technical explanation on relations and cascade deletion, see the [Data Schema Guide](docs/DATABASE_SCHEMA.en.md).**

---

## 🛠️ Tech Stack: Why these tools?

Every piece of the stack was chosen to serve a specific purpose in the user experience:

### Frontend (Immersion & Reactivity)

- **[Next.js 16](https://nextjs.org/) (App Router):** The foundation for fast navigation and SEO/Performance optimization via Server Components.
- **[React Compiler](https://react.dev/learn/react-compiler):** Automatic memoization keeps the UI fluid without the mental overhead of `useMemo` or `useCallback`.
- **[Zustand](https://docs.pmnd.rs/zustand/):** Manages the state of complex flows, like the multi-step campaign creation _wizard_, keeping logic out of components.
- **[Framer Motion](https://www.framer.com/motion/):** Delivers the "magical" interactivity and animations (like the 3D portal carousel) that define the app's aesthetic.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Ultra-fast styling with native CSS variables.

### Backend & Infrastructure (Robustness)

- **[Supabase (PostgreSQL)](https://supabase.com/):** Powerful relational database. The `@supabase/supabase-js` client is used directly for all queries — service role key on the server (bypasses RLS, equivalent to a trusted ORM), JWT token on the client (RLS-enforced upload operations).
- **[Prisma](https://www.prisma.io/) (`devDependency` only):** Serves two compile-time purposes: generating TypeScript types via `prisma generate` (used as `import type`, zero bundle impact) and managing SQL migrations via CLI. Not instantiated at runtime.
- **[Sileo](https://www.npmjs.com/package/sileo):** Lightweight, themeable toast notification system for user feedback.
- **[Clerk](https://clerk.com/):** Professional-grade authentication with automatic profile synchronization.

---

## 🏁 Installation & Development

1. **Clone & Install:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   npm install
   ```

2. **Env Variables:** Create a `.env` file with the following keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   CLERK_WEBHOOK_SECRET=
   ```
3. **Database:** Apply the SQL migrations from `prisma/migrations/` via the Supabase SQL Editor, or use the Supabase CLI:
   ```bash
   supabase db push
   ```
4. **Run Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Development & Seeding

Since this project uses Clerk for authentication, seeding the database requires linking test data to real Clerk users.

1.  **Configure your emails:** Add your development user emails (GM and Player) to `.env`:
    ```env
    SEED_GM_EMAIL=your-gm-email@example.com
    SEED_PLAYER_EMAIL=your-player-email@example.com
    ```
2.  **Sync:** Run the app (`npm run dev`) and sign in with those emails to ensure the user records exist in the database (auto-created on login via _Lazy Sync_).
3.  **Run:** Launch the seed script:
    ```bash
    npm run db:seed
    ```
    This will populate the database with a test campaign (_Curse of Strahd_) where the GM user is the Master and the Player will have a character assigned.

---

## 🧪 Testing Strategy

We maintain a two-layer test suite to ensure the "game table" never breaks:

| Layer                  | Tool                       | Scope                                                                                            | Command            |
| :--------------------- | :------------------------- | :----------------------------------------------------------------------------------------------- | :----------------- |
| **Unit & Integration** | Vitest 4 + Testing Library | Pure utils, Zustand store, React components (campaigns, encyclopedia) with mocked server actions | `npm run test:run` |
| **End-to-End**         | Playwright (Chromium)      | Full browser flows: Portal carousel, campaign creation wizard, encyclopedia navigation           | `npm run test:e2e` |

### Running E2E Tests

E2E tests require one extra environment variable:

```env
# .env — required for Playwright auth via @clerk/testing
E2E_CLERK_USER_EMAIL=your-test-user@example.com
```

The user must already exist in Clerk and have logged in at least once to sync their record.

### Cascade Deletion

Deletion rules (_Cascade vs SetNull_) are defined at the database level in the migration SQL files under `prisma/migrations/`. See [Data Schema Guide](docs/DATABASE_SCHEMA.en.md) for the full breakdown.

---

## 📜 Scripts and commands

| Command                        | Description                        |
| ------------------------------ | ---------------------------------- |
| `npm run dev`                  | Start development server           |
| `npm run build`                | Build for production               |
| `npm run start`                | Start production server            |
| `npm run lint`                 | Run ESLint                         |
| `npm run test`                 | Vitest in watch mode               |
| `npm run test:ui`              | Vitest with interactive browser UI |
| `npm run test:run`             | Vitest single run (CI)             |
| `npm run test:coverage`        | Vitest with v8 coverage report     |
| `npm run test:e2e`             | Playwright E2E (headless)          |
| `npm run test:e2e:ui`          | Playwright E2E with interactive UI |
| `npm run db:seed`              | Seed the database                  |
| `npx -y react-doctor@latest .` | Audit React project health         |

## 🔒 Private Project

This is a private project. It is not open to contributions at this time.
All rights reserved.
