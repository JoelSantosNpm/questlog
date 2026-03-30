# 🗄️ Database Schema: The Heart of Questlog

This guide explains how data is organized in Questlog, its relationships, and the integrity rules that keep the game world consistent.

---

## 🏗️ The Mental Model: Three Data Layers

To understand Questlog, imagine the data divided into three levels:

1.  **Identity (Users):** Who you are (DM or Player) as tracked by Clerk.
2.  **The Encyclopedia (Templates):** The "monster manual" and "item catalogue". These are reusable blueprints.
3.  **The Session (Instances):** What happens "at the table". Live campaigns, wounded monsters, and characters with inventories.

---

## 🌳 Relations & Cascade Diagram

### 1. The World Owner (User)

- **Relation:** A user is the `Game Master` of many campaigns.
- **Cascade Delete:** If you delete a user, **all their campaigns and characters are deleted**. The world disappears with its creator.

### 2. The Game Table (Campaign)

- **Relation:** The main container. Inside there are notes, quests, active monsters, and items.
- **Golden Rule:** Everything that "belongs" to a campaign dies with it (notes, quests, active monsters).
- **Exception (Characters):** If you delete a campaign, characters **are not deleted** (`onDelete: SetNull`). The hero survives and sits "in limbo", ready to be assigned to another adventure in the future.

### 3. Template vs Instance (The "Mold" and the "Figure")

Questlog separates the definition of a being (Template) from its presence in combat (Instance).

- **MonsterTemplate:** Defines that a "Goblin" has 10 HP and 12 AC.
- **ActiveMonster:** Is "The corner Goblin" that has 4 HP because it already took an arrow.
  - _Rule:_ Deleting the goblin template does not delete the wounded goblin in your campaign; it simply loses the link to its manual.

- **ItemTemplate:** Defines what a "Healing Potion" is.
- **Item:** Is the specific potion a warrior carries in their backpack.
  - _Rule:_ If the warrior dies or is deleted, the item **survives** in the campaign (`characterId` becomes NULL). The loot drops to the ground and is available for someone else to pick up.

---

## 🛡️ Atomic Columns vs JSON: Why the Change?

Previously, stats (Strength, Dexterity...) were stored in a JSON "bag" field. Now they are **Atomic (Individual) Columns**.

- **Real Filters:** We can ask the DB: _"Give me all epic items that grant +2 AC"_. Before, this was nearly impossible to process quickly.
- **Combat Calculations:** Being plain numbers in the table, the database engine can sum item bonuses and character stats instantly.

---

## 🔑 Permissions System (AccessGrant)

Questlog does not only check who the owner is. The `AccessGrant` table allows:

- A DM to **share** their campaign with a co-DM (EDIT permission).
- A player to **view** a legendary item in another user's encyclopedia (VIEW permission).
- It is based on a triple relation: `User` + `Resource` (Campaign, Monster, etc.) + `Access Level`.

---

## 📝 Delete Summary (Integrity)

| If you delete a... | Also deleted (Cascade)                      | Survives (SetNull)                              |
| :----------------- | :------------------------------------------ | :---------------------------------------------- |
| **User**           | Campaigns, Characters, created Templates    | -                                               |
| **Campaign**       | Notes, Quests, Active Monsters, World Items | Characters (Heroes)                             |
| **Character**      | -                                           | Items they carried (fall to the campaign floor) |
| **Template**       | -                                           | Instances based on it (become orphaned)         |

---

## ⚙️ Schema Management & Migrations

The schema is defined in `prisma/schema.prisma` as the **structural source of truth**, but Prisma is **not used at runtime**. All database access is handled directly by the `@supabase/supabase-js` client using the `service_role` key on the server.

### Applying migrations

SQL migrations live in `prisma/migrations/`. To apply them to a new environment:

```bash
# Option 1: Supabase CLI
supabase db push

# Option 2: Run the SQL files manually from the Supabase SQL Editor
# prisma/migrations/*/migration.sql
```

### Creating a new schema change

1. Modify `prisma/schema.prisma`.
2. Generate the migration SQL: `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`
3. Apply the resulting SQL in Supabase.

### Required environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=          # Public project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Anonymous key (browser client)
SUPABASE_SERVICE_ROLE_KEY=         # Service role key (server only, never expose)
```
