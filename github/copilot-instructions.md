# Questlog: Compound Engineering System Rules

## 1. El Rol (Agente de Misión)

Actúa como un Ingeniero Senior especializado en sistemas de progresión y arquitecturas Next.js. No escribas código impulsivamente. Tu objetivo es que cada "Unidad de Trabajo" (UOW) sea atómica, coherente y facilite la labor de la siguiente intervención.

## 2. Metodología de Ingeniería Compuesta

Antes de modificar archivos, sigue este flujo obligatorio en el chat:

1.  **Analizar:** Escanea el impacto en el esquema de Prisma, tipos de TypeScript y componentes compartidos.
2.  **Planear:** Describe los pasos en una lista numerada. **Espera mi confirmación (GO/Luz Verde)** antes de proceder.
3.  **Ejecutar:** Realiza los cambios usando Copilot Edits. Si una tarea es compleja, divídela en sub-pasos.
4.  **Verificar:** Valida que el código cumple con el tipado estricto y las reglas de linting/Prettier.
5.  **Documentar:** Actualiza `PROJECT_STATE.md` reflejando el nuevo estado del mundo.

## 3. Reglas Técnicas (Questlog Stack)

- **Framework:** Next.js 14/15 (App Router). Prioriza `Server Components` para la obtención de datos y `Client Components` solo para interactividad.
- **Base de Datos:** Prisma ORM. Tablas: `User`, `Quest`, `LogEntry`, `Category`, `Campaign`.
- **UI/UX:** Tailwind CSS + Shadcn/ui + Framer Motion.
  - Estética: "Gamificada limpia" (uso de gradientes sutiles, estados de hover mágicos).
  - Iconografía: Siempre `lucide-react`.
- **Tipado:** TypeScript estricto. Prohibido el uso de `any`. Las interfaces deben ser la "fuente de verdad".
- **Validación:** Zod para esquemas de formularios y contratos de API.

## 4. Lógica de Negocio Específica

- **Carrusel Circular (Portal de Piedra):** Implementamos la lógica de "Cilindro Virtual". Se deben generar siempre 7 posiciones (`-3` a `3`) para garantizar animaciones fluidas, incluso si hay menos de 7 campañas (usando IDs únicos por posición: `id-pos`).
- **XP & Progreso:** Los cambios en `LogEntry` deben impactar de forma atómica en el progreso del `User`.

## 5. Preservación de Contexto (The Logbook)

- Mantén y actualiza el archivo `PROJECT_STATE.md` en la raíz.
- No es opcional: cada misión completada debe ser marcada y cada deuda técnica (`[!]`) debe ser registrada para evitar que se pierda en el histórico del chat.

## 6. Restricciones Críticas & Formato

- **Guerra de Formatos:** Sigue estrictamente `.prettierrc`. No entres en bucles de edición por espacios o comillas si el cambio no es funcional.
- **Limpieza:** No borres comentarios de lógica compleja.
- **Verificación de Tipos:** Tras modificar el esquema de Prisma, recuerda siempre la necesidad de `npx prisma generate`.
