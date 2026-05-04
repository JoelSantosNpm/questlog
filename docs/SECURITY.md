# 🔐 Security & Access Control: RLS in Questlog

[🇪🇸 Español](SECURITY.md) | **🇺🇸 English**

This guide explains how Questlog protects data at the database level using PostgreSQL/Supabase Row Level Security (RLS), and how server-side code interacts with those policies.

---

## 🏗️ The Mental Model: Two Security Layers

Security in Questlog operates in two layers working together:

1. **Application layer (Next.js):** `requireUserId()` and Clerk's `auth()` ensure the user is authenticated before any Server Action executes.
2. **Database layer (PostgreSQL):** RLS ensures that even if a bug or malicious user bypasses the application layer, the database only returns or modifies rows that belong to them.

```
Client → Server Action → requireUserId() → withRLS(clerkId) → PostgreSQL + RLS
```

---

## 🔑 The `current_user_id()` Function

This is the key piece. It lives in Supabase and automatically detects where the active user's ID comes from:

| Origin               | How the userId arrives                             |
| -------------------- | -------------------------------------------------- |
| Prisma + `withRLS()` | `set_config('app.current_user_id', clerkId, true)` |
| Supabase SDK (JWT)   | `auth.uid()` from the JWT token                    |

```sql
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text AS $$
  SELECT COALESCE(
    nullif(current_setting('app.current_user_id', true), ''),
    auth.uid()::text
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

> **Why COALESCE and not OR:** `OR` is not a coalescing operator in SQL for `text` values. `COALESCE` returns the first non-null value in the list.

---

## ⚙️ Prisma Client Architecture

The project exposes two distinct clients from `src/shared/lib/prisma.ts`:

### `prismaAdmin`

- Connects as `postgres` (Supabase superuser)
- **Bypasses RLS entirely** — Postgres ignores all policies for superusers
- Allowed **only** in:
  - `src/app/api/webhooks/clerk/route.ts` — user sync via Clerk webhook
  - `src/app/auth/auth-sync.tsx` — initial `User` record creation
  - `src/views/encyclopedia/api/encyclopedia-queries.ts` — public catalog reads (`isPublic: true`)

### `withRLS(clerkId, fn)`

- Runs `fn` inside a `$transaction` that executes two steps before any query:
  1. `SET LOCAL ROLE authenticated` — switches to the restricted role so Postgres evaluates RLS
  2. `set_config('app.current_user_id', clerkId, true)` — sets the userId for `current_user_id()`
- **Required** in all Server Actions and end-user data queries

```typescript
// ✅ Correct
const campaign = await withRLS(clerkId, (db) => db.campaign.create({ data }))

// ❌ Incorrect — bypasses RLS
const campaign = await prismaAdmin.campaign.create({ data })
```

> **Why SET LOCAL and not SET:** `SET LOCAL` scopes the role change to the current transaction. When the transaction ends, the connection resets to `postgres` and can be reused by the pool without contaminating other requests.

---

## 📋 RLS Policies by Table

The SQL file defining all policies is [`supabase/migrations/20260504_rls_policies.sql`](../supabase/migrations/20260504_rls_policies.sql).

### User

| Operation | Policy                                                    |
| --------- | --------------------------------------------------------- |
| SELECT    | Only the owner themselves (`clerkId = current_user_id()`) |
| UPDATE    | Only the owner themselves                                 |
| INSERT    | ❌ Forbidden — only `postgres` via webhook/AuthSync       |

### Campaign

| Operation | Policy                                                                  |
| --------- | ----------------------------------------------------------------------- |
| SELECT    | Public campaigns (`isPublic = true`) OR user is a member (`Membership`) |
| INSERT    | `gameMasterId` must match the active user                               |
| UPDATE    | Only OWNER or EDITOR (via `Membership`)                                 |
| DELETE    | Only the original `gameMaster`                                          |

### Membership

| Operation                  | Policy                                                 |
| -------------------------- | ------------------------------------------------------ |
| SELECT                     | Own memberships + fellow campaign members' memberships |
| ALL (INSERT/UPDATE/DELETE) | Only the campaign's `gameMaster` can manage members    |

### Character

| Operation | Policy                                                |
| --------- | ----------------------------------------------------- |
| SELECT    | Any campaign member                                   |
| INSERT    | Any campaign member                                   |
| UPDATE    | The character owner (`userId`) OR a DM (OWNER/EDITOR) |
| DELETE    | The character owner (`userId`) OR a DM (OWNER/EDITOR) |

### ActiveMonster / Item

| Operation                  | Policy               |
| -------------------------- | -------------------- |
| SELECT                     | Any campaign member  |
| ALL (INSERT/UPDATE/DELETE) | Only OWNER or EDITOR |

### Quest

| Operation                  | Policy                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------ |
| SELECT                     | OWNER/EDITOR see all; PLAYER/VIEWER only see those flagged `visibleToPlayers = true` |
| ALL (INSERT/UPDATE/DELETE) | Only OWNER or EDITOR                                                                 |

### SessionNote

| Operation                  | Policy                                  |
| -------------------------- | --------------------------------------- |
| SELECT                     | Only OWNER or EDITOR (DM private notes) |
| ALL (INSERT/UPDATE/DELETE) | Only OWNER or EDITOR                    |

### Templates (MonsterTemplate / CharacterTemplate / ItemTemplate)

| Operation | Policy                                                        |
| --------- | ------------------------------------------------------------- |
| SELECT    | Public templates (`isPublic = true`) OR the author themselves |
| INSERT    | Only the author (`authorId/creatorId = current_user_id()`)    |
| UPDATE    | Only the author                                               |
| DELETE    | Only the author                                               |

### AccessGrant

| Operation                  | Policy                                                   |
| -------------------------- | -------------------------------------------------------- |
| SELECT                     | The recipient (`granteeId`) OR the granter (`granterId`) |
| ALL (INSERT/UPDATE/DELETE) | Only the granter (`granterId`)                           |

---

## 🚀 How to Apply the Policies

Policies **are not managed by `prisma migrate`** — Prisma only handles structural DDL (tables, columns, indexes). RLS policies are applied manually:

1. Open **Supabase Dashboard → SQL Editor**
2. Paste the contents of `supabase/migrations/20260504_rls_policies.sql`
3. Execute

> If you add new tables in the future, remember: `ENABLE ROW LEVEL SECURITY` + `GRANT` to the `authenticated` role + corresponding policies.

---

## 🗂️ Relevant Files

| File                                            | Responsibility                                                 |
| ----------------------------------------------- | -------------------------------------------------------------- |
| `src/shared/lib/prisma.ts`                      | `prismaAdmin` and `withRLS()`                                  |
| `src/shared/lib/auth.ts`                        | `requireUserId()` — retrieves clerkId from session             |
| `supabase/migrations/20260504_rls_policies.sql` | Full RLS policies + `current_user_id()`                        |
| `src/views/*/api/*-actions.ts`                  | Server Actions — use `withRLS`                                 |
| `src/views/*/api/*-queries.ts`                  | Read queries — `withRLS` or `prismaAdmin` depending on context |
