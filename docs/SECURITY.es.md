# 🔐 Seguridad y Control de Acceso: RLS en Questlog

**🇪🇸 Español** | [🇺🇸 English](SECURITY.en.md)

Esta guía explica cómo Questlog protege los datos a nivel de base de datos usando Row Level Security (RLS) de PostgreSQL/Supabase, y cómo el código del servidor interactúa con esas políticas.

---

## 🏗️ El Modelo Mental: Dos Capas de Seguridad

La seguridad en Questlog opera en dos capas que trabajan juntas:

1. **Capa de aplicación (Next.js):** `requireUserId()` y `auth()` de Clerk garantizan que el usuario está autenticado antes de ejecutar cualquier Server Action.
2. **Capa de base de datos (PostgreSQL):** RLS garantiza que aunque un bug o un usuario malicioso sortee la capa de aplicación, la base de datos solo devuelve o modifica las filas que le pertenecen.

```
Cliente → Server Action → requireUserId() → withRLS(clerkId) → PostgreSQL + RLS
```

---

## 🔑 La Función `current_user_id()`

Es la pieza clave. Vive en Supabase y detecta automáticamente de dónde viene el userId del usuario activo:

| Origen               | Cómo llega el userId                               |
| -------------------- | -------------------------------------------------- |
| Prisma + `withRLS()` | `set_config('app.current_user_id', clerkId, true)` |
| Supabase SDK (JWT)   | `auth.uid()` del token JWT                         |

```sql
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS text AS $$
  SELECT COALESCE(
    nullif(current_setting('app.current_user_id', true), ''),
    auth.uid()::text
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

> **Por qué COALESCE y no OR:** `OR` no es un operador de coalescencia en SQL para valores `text`. `COALESCE` devuelve el primer valor no nulo de la lista.

---

## ⚙️ Arquitectura de Clientes Prisma

El proyecto expone dos clientes distintos desde `src/shared/lib/prisma.ts`:

### `prismaAdmin`

- Conecta como `postgres` (superusuario de Supabase)
- **Bypasea RLS completamente** — Postgres ignora todas las políticas para superusuarios
- Uso permitido **solo** en:
  - `src/app/api/webhooks/clerk/route.ts` — sincronización de usuarios vía Clerk webhook
  - `src/app/auth/auth-sync.tsx` — creación inicial del registro `User`
  - `src/views/encyclopedia/api/encyclopedia-queries.ts` — lectura de catálogo público (`isPublic: true`)

### `withRLS(clerkId, fn)`

- Ejecuta `fn` dentro de una `$transaction` que hace dos pasos antes de cualquier query:
  1. `SET LOCAL ROLE authenticated` — cambia el rol al restringido para que Postgres evalúe RLS
  2. `set_config('app.current_user_id', clerkId, true)` — establece el userId para `current_user_id()`
- Uso **obligatorio** en todas las Server Actions y queries de datos de usuario final

```typescript
// ✅ Correcto
const campaign = await withRLS(clerkId, (db) => db.campaign.create({ data }))

// ❌ Incorrecto — bypasea RLS
const campaign = await prismaAdmin.campaign.create({ data })
```

> **Por qué SET LOCAL y no SET:** `SET LOCAL` limita el cambio de rol a la transacción actual. Cuando la transacción termina, la conexión vuelve a `postgres` y puede reutilizarse por el pool sin contaminar otras requests.

---

## 📋 Políticas RLS por Tabla

El archivo SQL que define todas las políticas es [`supabase/migrations/20260504_rls_policies.sql`](../supabase/migrations/20260504_rls_policies.sql).

### User

| Operación | Política                                               |
| --------- | ------------------------------------------------------ |
| SELECT    | Solo el propio usuario (`clerkId = current_user_id()`) |
| UPDATE    | Solo el propio usuario                                 |
| INSERT    | ❌ Prohibido — solo `postgres` vía webhook/AuthSync    |

### Campaign

| Operación | Política                                                                                   |
| --------- | ------------------------------------------------------------------------------------------ |
| SELECT    | Campañas públicas (`isPublic = true`) O el GM es el usuario activo O el usuario es miembro |
| INSERT    | `gameMasterId` debe ser el usuario activo                                                  |
| UPDATE    | El GM de la campaña O un miembro con rol OWNER/EDITOR                                      |
| DELETE    | Solo el `gameMaster` original                                                              |

> **Nota sobre recursión:** `Campaign_Select` y `Campaign_Update` originalmente causaban recursión infinita porque leían `Membership` (que a su vez leía `Campaign`). Se resuelve con dos funciones `SECURITY DEFINER` que leen directamente sin RLS: `is_campaign_member()` y `can_edit_campaign()`. Ver [`supabase/migrations/20260505_fix_rls_recursion.sql`](../supabase/migrations/20260505_fix_rls_recursion.sql) y [`supabase/migrations/20260508_fix_campaign_update_recursion.sql`](../supabase/migrations/20260508_fix_campaign_update_recursion.sql).

### Membership

| Operación                  | Política                                                    |
| -------------------------- | ----------------------------------------------------------- |
| SELECT                     | Propias membresías + membresías de compañeros de campaña    |
| ALL (INSERT/UPDATE/DELETE) | Solo el `gameMaster` de la campaña puede gestionar miembros |

### Character

| Operación | Política                                                 |
| --------- | -------------------------------------------------------- |
| SELECT    | Cualquier miembro de la campaña                          |
| INSERT    | Cualquier miembro de la campaña                          |
| UPDATE    | El dueño del personaje (`userId`) O un DM (OWNER/EDITOR) |
| DELETE    | El dueño del personaje (`userId`) O un DM (OWNER/EDITOR) |

### ActiveMonster / Item

| Operación                  | Política                        |
| -------------------------- | ------------------------------- |
| SELECT                     | Cualquier miembro de la campaña |
| ALL (INSERT/UPDATE/DELETE) | Solo OWNER o EDITOR             |

### Quest

| Operación                  | Política                                                                          |
| -------------------------- | --------------------------------------------------------------------------------- |
| SELECT                     | OWNER/EDITOR ven todas; PLAYER/VIEWER solo las marcadas `visibleToPlayers = true` |
| ALL (INSERT/UPDATE/DELETE) | Solo OWNER o EDITOR                                                               |

### SessionNote

| Operación                  | Política                                    |
| -------------------------- | ------------------------------------------- |
| SELECT                     | Solo OWNER o EDITOR (notas privadas del DM) |
| ALL (INSERT/UPDATE/DELETE) | Solo OWNER o EDITOR                         |

### Templates (MonsterTemplate / CharacterTemplate / ItemTemplate)

| Operación | Política                                                  |
| --------- | --------------------------------------------------------- |
| SELECT    | Plantillas públicas (`isPublic = true`) O el propio autor |
| INSERT    | Solo el autor (`authorId/creatorId = current_user_id()`)  |
| UPDATE    | Solo el autor                                             |
| DELETE    | Solo el autor                                             |

### AccessGrant

| Operación                  | Política                                               |
| -------------------------- | ------------------------------------------------------ |
| SELECT                     | El receptor (`granteeId`) O el otorgador (`granterId`) |
| ALL (INSERT/UPDATE/DELETE) | Solo el otorgador (`granterId`)                        |

---

## �️ Storage RLS (questlog-assets)

El bucket `questlog-assets` almacena imágenes y archivos de usuario con la estructura:

```
questlog-assets/
  {userId}/
    campaigns/{campaignId}/{archivo}
    profile/{archivo}
    templates/{tipo}/{templateId}/{archivo}
```

| Operación | Política                                                                         |
| --------- | -------------------------------------------------------------------------------- |
| SELECT    | Carpeta propia (`{userId}/...`) O carpeta de campaña donde el usuario es miembro |
| INSERT    | Solo a la propia carpeta raíz (`{userId}/...`)                                   |
| DELETE    | Carpeta propia O miembro con rol OWNER/EDITOR de la campaña referenciada         |

El bucket `system` es de lectura pública; escritura solo vía `service_role`.

### Prevención de archivos huérfanos

Supabase no permite crear triggers en `storage.objects` desde el SQL Editor (`permission denied for schema storage`). La validación se hace en la **capa de aplicación**: antes de llamar a `supabase.storage.upload()`, la Server Action verifica que la entidad referenciada exista en BD:

```typescript
// ✅ Patrón correcto en una Server Action de subida
const campaign = await prismaAdmin.campaign.findUnique({ where: { id: campaignId } })
if (!campaign) throw new Error(`Campaña no encontrada: ${campaignId}`)

await supabase.storage.from('questlog-assets').upload(path, file)
```

Ver [`supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`](../supabase/migrations/20260508_storage_rls_and_orphan_guard.sql).

---

## 🚀 Cómo Aplicar las Políticas

Las políticas **no se gestionan con `prisma migrate`** — Prisma solo gestiona DDL estructural (tablas, columnas, índices). Las políticas RLS se aplican manualmente en el SQL Editor de Supabase en este orden:

| #   | Archivo                                                          | Contenido                                                                      |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | `supabase/migrations/20260504_rls_policies.sql`                  | Políticas base + `current_user_id()` + GRANTs                                  |
| 2   | `supabase/migrations/20260505_fix_rls_recursion.sql`             | Fix recursión `Campaign_Select` / `Membership_Select` + `is_campaign_member()` |
| 3   | `supabase/migrations/20260508_fix_campaign_update_recursion.sql` | Fix recursión `Campaign_Update` + `can_edit_campaign()` / `is_campaign_gm()`   |
| 4   | `supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`  | Políticas RLS de Storage                                                       |

> Si añades nuevas tablas en el futuro, recuerda: `ENABLE ROW LEVEL SECURITY` + `GRANT` al rol `authenticated` + políticas correspondientes.

---

## 🗂️ Archivos Relevantes

| Archivo                                                          | Responsabilidad                                                            |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `src/shared/lib/prisma.ts`                                       | `prismaAdmin` y `withRLS()`                                                |
| `src/shared/lib/auth.ts`                                         | `requireUserId()` — obtiene clerkId de la sesión                           |
| `supabase/migrations/20260504_rls_policies.sql`                  | Políticas RLS base + `current_user_id()` + GRANTs                          |
| `supabase/migrations/20260505_fix_rls_recursion.sql`             | Fix recursión + `is_campaign_member()`                                     |
| `supabase/migrations/20260508_fix_campaign_update_recursion.sql` | Fix recursión Campaign_Update + `can_edit_campaign()` / `is_campaign_gm()` |
| `supabase/migrations/20260508_storage_rls_and_orphan_guard.sql`  | Políticas RLS de Storage                                                   |
| `supabase/rls_tests.sql`                                         | Tests de RLS — ejecutar en SQL Editor, resultados en pestaña Results       |
| `src/views/*/api/*-actions.ts`                                   | Server Actions — usan `withRLS`                                            |
| `src/views/*/api/*-queries.ts`                                   | Queries de lectura — `withRLS` o `prismaAdmin` según contexto              |
