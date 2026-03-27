# ⚔️ QuestLog - RPG Campaign Manager

**🇺🇸 English** | [🇪🇸 Español](README.es.md)

> **Status:** Active development. See [PROJECT_STATE.md](PROJECT_STATE.md) for the current milestone progress.

**QuestLog** is a Grimdark-themed platform for Dungeon Masters seeking immersive and efficient D&D 5e campaign management. It provides tools for tracking narrative progression, inventory, bestiary, and live combat encounters.

---

## ⚔️ Open Zones

- **The Stone Portal:** 3D perspective circular carousel to navigate between campaigns, with keyboard support and immersive animations.
- **Authentication (Clerk):** Secure sign-in/sign-up with automatic profile sync to the database (_Lazy Sync_).
- **Adventure Creation:** An animated multi-step _wizard_ that weaves your inputs into campaign lore, powered by Zustand + React Hook Form + Framer Motion.

---

## 🔮 The Illustrated Tome

### The Stone Portal — Campaign Selection

![The Stone Portal — Campaign Selection](public/screenshots/campaign-portals.png)

> Navigate your campaigns through a 3D stone portal carousel

### Adventure Creation Form

![Adventure Creation Form](public/screenshots/campaign-creation.png)

> A narrative-driven multi-step wizard that turns your inputs into campaign lore

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

- **[Supabase (PostgreSQL)](https://supabase.com/):** Powerful relational database for managing complex quest, character, and item networks.
- **[Prisma ORM](https://www.prisma.io/):** Provides Type Safety across the entire data layer.
- **[Clerk](https://clerk.com/):** Professional-grade authentication with automatic profile synchronization.

---

## 🏁 Installation & Development

1. **Clone & Install:**

   ```bash
   git clone https://github.com/JoelSantosNpm/questlog.git
   npm install
   ```

2. **Env Variables:** Create a `.env` file based on `.env.example`.
3. **Database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev
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

| Layer                  | Tool                       | Scope                                                                  | Command            |
| :--------------------- | :------------------------- | :--------------------------------------------------------------------- | :----------------- |
| **Unit & Integration** | Vitest 4 + Testing Library | Pure utils, Zustand store, React components with mocked server actions | `npm run test:run` |
| **End-to-End**         | Playwright (Chromium)      | Full browser flows: Portal carousel + campaign creation wizard         | `npm run test:e2e` |

### Test Commands

```bash
npm run test          # Vitest in watch mode (development)
npm run test:run      # Vitest single run (CI)
npm run test:coverage # Vitest run with v8 coverage report
npm run test:e2e      # Playwright E2E (headless)
npm run test:e2e:ui   # Playwright E2E with interactive UI
```

### Running E2E Tests

E2E tests require one extra environment variable:

```env
# .env — required for Playwright auth via @clerk/testing
E2E_CLERK_USER_EMAIL=your-test-user@example.com
```

The user must already exist in Clerk and have logged in at least once to sync their record.

### Cascade Deletion Tests (Data Integrity)

To verify that deletion rules (_Cascade vs SetNull_) protect player data, run:

```bash
npx tsx --env-file=.env prisma/test-cascade.ts
```

This script simulates critical scenarios (delete GM, delete Campaign, delete Player) and validates that, for example, characters survive even if their campaign is deleted.

---

## 📂 Project Structure

```
src/
├── app/                        # Routes and pages (App Router)
│   ├── campaigns/              # Campaign pages
│   │   ├── page.tsx            # Portal carousel (campaign selection)
│   │   ├── creation/           # Campaign creation form
│   │   └── [id]/               # Campaign detail
│   ├── colosseum/              # Combat tracker (El Coliseo)
│   ├── dashboard/              # Main dashboard
│   ├── sign-in/ & sign-up/     # Authentication pages
│   └── layout.tsx              # Root layout (includes AuthSync)
├── actions/
│   └── campaign-actions.ts     # Server Actions (create campaign, etc.)
├── components/
│   ├── auth/
│   │   └── auth-sync.tsx       # Lazy sync: Clerk → Prisma
│   ├── campaigns/creation/     # Multi-step campaign creation form
│   │   ├── CampaignCreationProvider.tsx  # RHF + Zustand context root
│   │   ├── CampaignCreationForm.tsx      # Animated narrative form
│   │   ├── StepControls.tsx             # Next/Skip/Submit step buttons
│   │   ├── hooks/useCampaignForm.ts      # Form and step logic
│   │   └── store/campaignStore.ts        # Step state in Zustand
│   ├── portal/                 # 3D carousel components
│   └── shared/ui/              # Reusable UI components
├── config/
│   ├── campaign-steps.ts       # Step definitions for campaign creation
│   ├── clerk-theme.ts          # Grimdark custom theme for Clerk
│   └── routes/auth.ts          # Public/protected route constants
├── data/
│   └── campaign-queries.ts     # Prisma read queries
├── lib/
│   ├── prisma.ts               # Prisma singleton with PrismaPg adapter
│   └── notifications.ts        # Toast notification helpers
├── hooks/ui/                   # Generic UI hooks (useCarousel)
├── providers/                  # App-level providers (AuthProvider)
└── types/                      # Shared TypeScript types
prisma/
├── schema.prisma               # Database schema
├── seed.ts                     # Database seeding script
└── test-cascade.ts             # Cascade deletion integrity tests
src/proxy.ts                    # Route protection middleware
```

## 📜 Scripts

| Command                        | Description                |
| ------------------------------ | -------------------------- |
| `npm run dev`                  | Start development server   |
| `npm run build`                | Build for production       |
| `npm run start`                | Start production server    |
| `npm run lint`                 | Run ESLint                 |
| `npm test`                     | Run unit tests             |
| `npm run db:seed`              | Seed the database          |
| `npx -y react-doctor@latest .` | Audit React project health |

## 🔒 Private Project

This is a private project. It is not open to contributions at this time.
All rights reserved.
