# QuestLog - RPG Campaign Manager

**🇺🇸 English** | [🇪🇸 Español](README.es.md)

> **Status:** Active development. See [PROJECT_STATE.md](PROJECT_STATE.md) for the current milestone progress.

**QuestLog** is a Grimdark-themed web application for Dungeon Masters to manage their D&D 5e campaigns. It provides tools for tracking narrative progression, inventory, bestiary, and combat encounters.

## 🚀 Features

- **The Portal**: 3D circular carousel for campaign navigation.
- **Authentication (Clerk)**: Secure sign-in/sign-up with automatic user sync to the database.
- **Session Notes (El Cronicón)**: Chronological session diary.
- **Inventory System (El Almacén)**: Loot, items, rarities, and quantities.
- **Bestiary & Combat Tracker (El Coliseo)**: Monster library + live initiative tracker.

## 📸 Screenshots

### The Portal — Campaign Selection

![The Portal — Campaign Selection](public/screenshots/campaign-portals.png)

> Navigate your campaigns through a 3D stone portal carousel

### Campaign Creation Form

![Campaign Creation Form](public/screenshots/campaign-creation.png)

> A narrative-driven multi-step form that weaves your input into lore

## 🛠 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Auth**: [Clerk](https://clerk.com/) + [`@clerk/nextjs`](https://www.npmjs.com/package/@clerk/nextjs)
- **Database**: [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/) with `@prisma/adapter-pg`
- **State Management**:
  - [Zustand](https://zustand-demo.pmnd.rs/) — client-side state for multi-step flows (e.g. campaign creation: step index, transitions)
  - [React Hook Form](https://react-hook-form.com/) — form validation and field management, integrated with Zustand via a Context provider
- **Compiler**: [React Compiler](https://react.dev/learn/react-compiler) (`babel-plugin-react-compiler`) — automatic memoization of components and values; no manual `useMemo`/`useCallback` needed. Run `npx -y react-doctor@latest .` to audit project health.
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Testing**: [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) (unit & integration) · [Playwright](https://playwright.dev/) (E2E)

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

   # Database Seeding (Optional)
   SEED_GM_EMAIL="your-gm-email@example.com"
   SEED_PLAYER_EMAIL="your-player-email@example.com"
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

## 🧪 Development & Seeding

Since this project uses Clerk for authentication, seeding the database requires linking mock data to real Clerk users.

1.  Add your development user emails (GM and Player) to `.env`:

    ```env
    SEED_GM_EMAIL=your-gm-email@example.com
    SEED_PLAYER_EMAIL=your-player-email@example.com
    ```

    _Note: These can be the same email if you want to test both roles with one account._

2.  Run the application (`npm run dev`) and sign in with those emails to ensure the user records exist in the database (synced on login).
3.  Run the seed script:
    ```bash
    npm run db:seed
    ```
    This will create a test campaign where `SEED_GM_EMAIL` is the Game Master, and assign a character to `SEED_PLAYER_EMAIL`.

## 🧪 Testing

The project uses a two-layer testing strategy:

| Layer              | Tool                       | Scope                                                                     | Command            |
| ------------------ | -------------------------- | ------------------------------------------------------------------------- | ------------------ |
| Unit & Integration | Vitest 4 + Testing Library | Pure utils, Zustand store, React components with mocked server actions    | `npm run test:run` |
| End-to-End         | Playwright (Chromium)      | Full browser flows: Portal carousel navigation + campaign creation wizard | `npm run test:e2e` |

### Commands

```bash
npm run test          # Vitest in watch mode (development)
npm run test:run      # Vitest single run (CI)
npm run test:coverage # Vitest run with v8 coverage report
npm run test:e2e      # Playwright E2E (headless)
npm run test:e2e:ui   # Playwright E2E with interactive UI
```

### Running E2E tests

E2E tests require the app to be running (the `webServer` config in `playwright.config.ts` starts it automatically) and one extra environment variable:

```env
# .env — required for Playwright auth via @clerk/testing
E2E_CLERK_USER_EMAIL=your-test-user@example.com
```

The user must already exist in Clerk and have logged in to the app at least once (to trigger the lazy sync to the database). The `CLERK_SECRET_KEY` already in your `.env` is reused — no extra keys needed.

### Cascade Deletion Tests (Data Integrity)

To verify that deletion rules (Cascade vs SetNull) are working correctly and data integrity is preserved (e.g., players keep their characters even if a campaign is deleted), you can run the test script:

```bash
npx tsx --env-file=.env prisma/test-cascade.ts
```

This script simulates multiple critical scenarios with detailed logging:

1.  **Delete Campaign**: Verifies that linked characters **survive** (SetNull), even if notes and monsters are removed.
2.  **Delete Player**: Verifies that if a user deletes their account, their character and inventory are **removed** (Cascade).
3.  **Delete GM**: Verifies that if a GM deletes their account, their campaigns are removed, but characters from _other players_ in those tables **survive**.

## � Data Model

Central campaign schema and its relationships with characters, monsters, items, and quests.

```prisma
model Campaign {
  id          String  @id @default(cuid())
  name        String
  description String?
  imageUrl    String?
  system      String  @default("D&D 5e")
  location    String?
  isPrivate   Boolean @default(true)

  gameMasterId String
  gameMaster   User   @relation(fields: [gameMasterId], references: [id], onDelete: Cascade)

  characters     Character[]    // onDelete: SetNull  — heroes survive campaign deletion
  notes          SessionNote[]  // onDelete: Cascade
  activeMonsters ActiveMonster[] // onDelete: Cascade
  quests         Quest[]         // onDelete: Cascade
}

model ActiveMonster {
  id        String  @id @default(cuid())
  name      String? // Optional alias (e.g. "One-Eyed Goblin")
  currentHp Int
  initiative Int?
  status    String[] // e.g. ["Poisoned", "Blinded"]

  templateId String?
  template   MonsterTemplate? @relation(fields: [templateId], references: [id], onDelete: SetNull)

  campaignId String
  campaign   Campaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)
}

model MonsterTemplate {
  id        String  @id @default(cuid())
  name      String
  type      String  // e.g. "Humanoid", "Dragon"
  challenge Float   @default(1.0)
  maxHp     Int
  ac        Int
  stats     Json
  abilities Json?

  isPublished Boolean @default(false)
  price       Float   @default(0.0) // Future marketplace

  instances ActiveMonster[]
}

model Character {
  id         String   @id @default(cuid())
  name       String
  level      Int      @default(1)
  currentHp  Int
  maxHp      Int
  stats      Json

  userId     String?
  user       User?     @relation(fields: [userId], references: [id], onDelete: Cascade)

  campaignId String?
  campaign   Campaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull)

  inventory  Item[]   // onDelete: Cascade
}

model Item {
  id       String  @id @default(cuid())
  name     String
  quantity Int     @default(1)
  rarity   String? // Common, Rare, Legendary...
  type     String? // Weapon, Potion, Gear
  value    Float?  // in Gold Pieces (gp)
  equipped Boolean @default(false)

  characterId String
  character   Character @relation(fields: [characterId], references: [id], onDelete: Cascade)
}
```

> **Key rule:** Deleting a `Campaign` removes notes, active monsters, and quests (Cascade), but characters are only **unlinked** (SetNull) — players never lose their heroes.

## �📂 Project Structure

```
src/
├── app/                        # Routes and pages (App Router)
│   ├── campaigns/              # Campaign pages
│   │   ├── page.tsx            # Portal carousel (campaign selection)
│   │   ├── creation/           # Campaign creation form
│   │   └── [id]/               # Campaign detail
│   ├── colosseum/              # Combat tracker (El Coliseo)
│   ├── dashboard/              # Main dashboard
│   ├── sign-in/ & sign-up/     # Auth pages
│   └── layout.tsx              # Root layout (includes AuthSync)
├── actions/
│   └── campaign-actions.ts     # Server Actions (create campaign, etc.)
├── components/
│   ├── auth/
│   │   └── auth-sync.tsx       # Lazy Sync: Clerk → Prisma
│   ├── campaigns/creation/     # Multi-step campaign creation form
│   │   ├── CampaignCreationProvider.tsx  # RHF + Zustand context root
│   │   ├── CampaignCreationForm.tsx      # Animated narrative form
│   │   ├── StepControls.tsx             # Next/Skip/Submit step buttons
│   │   ├── hooks/useCampaignForm.ts      # Form & step logic
│   │   └── store/campaignStore.ts        # Zustand step state
│   ├── portal/                 # 3D carousel components
│   └── shared/ui/              # Reusable UI components
├── config/
│   ├── campaign-steps.ts       # Step definitions for campaign creation
│   ├── clerk-theme.ts          # Custom Grimdark Clerk theme
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
├── schema.prisma               # DB schema
├── seed.ts                     # DB seeding script
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

This is a private project. Not open for contributions at this time.
