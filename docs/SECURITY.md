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

| Operation | Policy                                                                                    |
| --------- | ----------------------------------------------------------------------------------------- |
| SELECT    | Public campaigns (`isPublic = true`) OR the GM is the active user OR the user is a member |
| INSERT    | `gameMasterId` must match the active user                                                 |
| UPDATE    | The campaign GM OR a member with OWNER/EDITOR role                                        |
| DELETE    | Only the original `gameMaster`                                                            |

> **Note on recursion:** `Campaign_Select` and `Campaign_Update` originally caused infinite recursion because they read `Membership` (which in turn read `Campaign`). This is resolved with two `SECURITY DEFINER` functions that read directly without RLS: `is_campaign_member()` and `can_edit_campaign()`. See [`supabase/migrations/20260505_fix_rls_recursion.sql`](../supabase/migrations/20260505_fix_rls_recursion.sql) and [`supabase/migrations/20260508_fix_campaign_update_recursion.sql`](../supabase/migrations/20260508_fix_campaign_update_recursion.sql).

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

## �️ Storage RLS (questlog-assets)

The `questlog-assets` bucket stores user images and files with the following structure:

```
questlog-assets/
  {userId}/
    campaigns/{campaignId}/{file}
    profile/{file}
    templates/{type}/{templateId}/{file}
```

| Operation | Policy                                                                    |
| --------- | ------------------------------------------------------------------------- |
| SELECT    | Own folder (`{userId}/...`) OR campaign folder where the user is a member |
| INSERT    | Only to the user's own root folder (`{userId}/...`)                       |
| DELETE    | Own folder OR OWNER/EDITOR member of the referenced campaign              |

The `system` bucket is publicly readable; writes only via `service_role`.

### Orphan File Prevention

Supabase does not allow creating triggers on `storage.objects` from the SQL Editor (`permission denied for schema storage`). Validation is handled at the **application layer**: before calling `supabase.storage.upload()`, the Server Action verifies that the referenced entity exists in the database:

```typescript
// ✅ Correct pattern in an upload Server Action
const campaign = await prismaAdmin.campaign.findUnique({ where: { id: campaignId } })
if (!campaign) throw new Error(`Campaign not found: ${campaignId}`)

await supabase.storage.from('questlog-assets').upload(path, file)
```

See [`supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`](../supabase/migrations/20260508_storage_rls_and_orphan_guard.sql).

---

## 🚀 How to Apply the Policies

Policies **are not managed by `prisma migrate`** — Prisma only handles structural DDL (tables, columns, indexes). RLS policies are applied manually in the Supabase SQL Editor in this order:

| #   | File                                                             | Contents                                                                           |
| --- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 1   | `supabase/migrations/20260504_rls_policies.sql`                  | Base policies + `current_user_id()` + GRANTs                                       |
| 2   | `supabase/migrations/20260505_fix_rls_recursion.sql`             | Recursion fix for `Campaign_Select` / `Membership_Select` + `is_campaign_member()` |
| 3   | `supabase/migrations/20260508_fix_campaign_update_recursion.sql` | Recursion fix for `Campaign_Update` + `can_edit_campaign()` / `is_campaign_gm()`   |
| 4   | `supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`  | Storage RLS policies                                                               |

> If you add new tables in the future, remember: `ENABLE ROW LEVEL SECURITY` + `GRANT` to the `authenticated` role + corresponding policies.

---

## 🗂️ Relevant Files

| File                                                             | Responsibility                                                             |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/shared/lib/prisma.ts`                                       | `prismaAdmin` and `withRLS()`                                              |
| `src/shared/lib/auth.ts`                                         | `requireUserId()` — retrieves clerkId from session                         |
| `supabase/migrations/20260504_rls_policies.sql`                  | Base RLS policies + `current_user_id()` + GRANTs                           |
| `supabase/migrations/20260505_fix_rls_recursion.sql`             | Recursion fix + `is_campaign_member()`                                     |
| `supabase/migrations/20260508_fix_campaign_update_recursion.sql` | Campaign_Update recursion fix + `can_edit_campaign()` / `is_campaign_gm()` |
| `supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`  | Storage RLS policies                                                       |
| `supabase/rls_tests.sql`                                         | RLS tests — run in SQL Editor, results in Results tab                      |
| `src/views/*/api/*-actions.ts`                                   | Server Actions — use `withRLS`                                             |
| `src/views/*/api/*-queries.ts`                                   | Read queries — `withRLS` or `prismaAdmin` depending on context             |
