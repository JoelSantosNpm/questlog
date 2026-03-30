# 🗄️ Esquema de Base de Datos: El Corazón de Questlog

Esta guía explica cómo se organizan los datos en Questlog, sus relaciones y las reglas de integridad que mantienen el mundo de juego consistente.

---

## 🏗️ El Modelo Mental: Tres Capas de Datos

Para entender Questlog, imagina los datos divididos en tres niveles:

1.  **Identidad (Usuarios):** Quién eres (DM o Jugador) según Clerk.
2.  **La Enciclopedia (Plantillas):** El "manual de monstruos" y el "catálogo de objetos". Son moldes reutilizables.
3.  **La Partida (Instancias):** Lo que ocurre "en la mesa". Campañas vivas, monstruos heridos y personajes con inventario.

---

## 🌳 Diagrama de Relaciones y Cascada

### 1. El Dueño del Mundo (User)

- **Relación:** Un usuario es el `Game Master` de muchas campañas.
- **Borrado en Cascada:** Si borras un usuario, **se borran todas sus campañas y personajes**. El mundo desaparece con su creador.

### 2. La Mesa de Juego (Campaign)

- **Relación:** Es el contenedor principal. Dentro hay notas, misiones, monstruos activos y objetos.
- **Regla de Oro:** Todo lo que "pertenece" a una campaña muere con ella (notas, misiones, monstruos activos).
- **Excepción (Personajes):** Si borras una campaña, los personajes **no se borran** (`onDelete: SetNull`). El héroe sobrevive y queda "en el limbo" para poder ser asignado a otra aventura en el futuro.

### 3. Plantilla vs Instancia (El "Molde" y la "Figura")

Questlog separa la definición de un ser (Plantilla) de su presencia en combate (Instancia).

- **MonsterTemplate:** Define que un "Trasgo" tiene 10 de vida y 12 de CA.
- **ActiveMonster:** Es "El Trasgo de la esquina" que tiene 4 de vida porque ya ha recibido un flechazo.
  - _Regla:_ Borrar la plantilla del trasgo no borra al trasgo herido en tu campaña; simplemente pierde el vínculo con su manual.

- **ItemTemplate:** Define qué es una "Poción de Curación".
- **Item:** Es la poción específica que lleva un guerrero en su mochila.
  - _Regla:_ Si el guerrero muere o se borra, el ítem **sobrevive** en la campaña (`characterId` pasa a ser NULL). El botín cae al suelo y queda disponible para que otro lo recoja.

---

## 🛡️ Atómicos vs JSON: ¿Por qué este cambio?

Anteriormente, las estadísticas (Fuerza, Destreza...) se guardaban en un campo "saco" llamado JSON. Ahora son **Columnas Atómicas (Individuales)**.

- **Filtros Reales:** Podemos preguntar a la DB: _"Dime todos los objetos épicos que den +2 de CA"_. Antes esto era casi imposible de procesar rápido.
- **Cálculos de Combate:** Al ser números planos en la tabla, el motor de la base de datos puede sumar bonificadores de ítems y estadísticas de personajes de forma instantánea.

---

## 🔑 Sistema de Permisos (AccessGrant)

Questlog no solo mira quién es el dueño. La tabla `AccessGrant` permite que:

- Un DM **comparta** su campaña con un co-DM (Permiso EDIT).
- Un jugador pueda **ver** un objeto legendario en la enciclopedia de otro usuario (Permiso VIEW).
- Se basa en una relación triple: `Usuario` + `Recurso` (Campaña, Monstruo, etc.) + `Nivel de Acceso`.

---

## 📝 Resumen de Borrados (Integridad)

| Si borras un... | Se borra también (Cascada)                          | Sobrevive (SetNull)                                   |
| :-------------- | :-------------------------------------------------- | :---------------------------------------------------- |
| **Usuario**     | Campañas, Personajes, Plantillas creadas            | -                                                     |
| **Campaña**     | Notas, Misiones, Monstruos Activos, Ítems del mundo | Personajes (Héroes)                                   |
| **Personaje**   | -                                                   | Los ítems que llevaba (caen al suelo de la campaña)   |
| **Plantilla**   | -                                                   | Las instancias basadas en ella (se vuelven huérfanas) |

---

## ⚙️ Gestión del Schema y Migraciones

El schema de Questlog se define en `prisma/schema.prisma` como **fuente de verdad estructural**, pero Prisma **no se usa en runtime**. El acceso a la base de datos se realiza directamente con el cliente `@supabase/supabase-js` usando la `service_role` key.

### Aplicar migraciones

Las migraciones SQL históricas viven en `prisma/migrations/`. Para aplicarlas a un entorno nuevo:

```bash
# Opción 1: Supabase CLI
supabase db push

# Opción 2: Ejecutar los .sql manualmente desde el SQL Editor de Supabase
# prisma/migrations/*/migration.sql
```

### Crear un nuevo cambio de schema

1. Modifica `prisma/schema.prisma`.
2. Genera el SQL de la migración: `npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script`
3. Aplica el SQL resultante en Supabase.

### Variables de entorno necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=          # URL pública del proyecto
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Clave anónima (cliente browser)
SUPABASE_SERVICE_ROLE_KEY=         # Clave de servicio (solo servidor, nunca exponer)
```
