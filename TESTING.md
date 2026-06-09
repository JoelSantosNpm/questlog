# Estrategia de Testing - Questlog

Este documento describe las prácticas, herramientas y organización del sistema de pruebas de Questlog.

## 🛠️ Stack de Testing

- **Unit/Integration:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **E2E:** [Playwright](https://playwright.dev/).
- **Mocks:** Vitest `vi` para servicios y módulos externos.
- **Coverage:** `@vitest/coverage-v8`.

> **Tests actuales:** ~230 tests unitarios pasando en 18+ archivos (carousel utils, storage schema, storage-actions, useImageUploader, ImageUploader UI, CampaignCreationForm, encyclopediaStore, image-fallbacks, use-encyclopedia-items, ListView, ItemHeader, EncyclopediaImage, **MonsterAvatarPanel, MonsterCreationView, MonsterForm**, useNotifyAuthRequired, campaign-queries, campaign-hooks, campaign-mutations) + 11 E2E pasando (3 portal-de-piedra, 8 encyclopedia).

---

## 📂 Organización de Archivos

Adoptamos una estructura centralizada en la carpeta raíz `tests/` para maximizar la escalabilidad y mantener la raíz del proyecto limpia.

```text
tests/
├── mocks/                                         # Utilidades de mock compartidas
│   └── intl.ts                                    # makeUseTranslations() — lee messages/es.json
├── features/    # Tests organizados por funcionalidad (Unit/Integration/UI)
│   ├── campaigns/
│   │   ├── api/
│   │   │   ├── campaign-queries.test.ts           # Filtros, seguridad (null/undefined), errores Prisma
│   │   │   ├── campaign-hooks.test.ts             # Normalización null→undefined en query keys
│   │   │   └── campaign-mutations.test.ts         # Llamadas a actions + invalidación de caché
│   │   └── components/CampaignCreationForm.test.tsx
│   ├── encyclopedia/
│   │   ├── lib/
│   │   │   ├── image-fallbacks.test.ts
│   │   │   └── use-encyclopedia-items.test.ts     # Hooks de queries de la enciclopedia
│   │   ├── model/encyclopediaStore.test.ts
│   │   └── ui/
│   │       ├── ItemHeader.test.tsx
│   │       ├── ListView.test.tsx
│   │       ├── EncyclopediaImage.test.tsx
│   │       └── monster-creation/
│   │           ├── MonsterForm.test.tsx           # Formulario create/edit + submit + auth
│   │           ├── MonsterCreationView.test.tsx   # Vista wrapper + toast de invitados
│   │           └── MonsterAvatarPanel.test.tsx
│   ├── shared/
│   │   └── lib/useNotifyAuthRequired.test.ts
│   ├── storage/
│   │   ├── actions/storage-actions.test.ts        # Server Action de subida (auth, validaciones)
│   │   ├── components/ImageUploader.test.tsx
│   │   ├── hooks/useImageUploader.test.ts
│   │   └── schemas/storage-schema.test.ts
│   └── ui/utils/carousel-utils.test.ts
├── e2e/         # Tests de extremo a extremo (Playwright)
│   ├── auth.setup.ts
│   ├── global.setup.ts
│   ├── portal-de-piedra.spec.ts   # Carrusel + creación de campaña
│   └── encyclopedia.spec.ts       # Navegación y detalle de enciclopedia
└── artifacts/   # Resultados, capturas y trazas de ejecuciones (Git ignored)
```

---

## 🧪 Tipos de Pruebas

### 1. Tests Unitarios (Schemas & Utils)

Se centran en funciones puras sin efectos secundarios.

- **Ejemplo:** Validar que `FileValidationSchema` rechace archivos de 3MB.

### 2. Hook Testing

Probamos la **máquina de estados** de nuestros hooks personalizados sin necesidad de renderizar toda la UI.

- **Herramienta:** `renderHook` de Testing Library.
- **Enfoque:** Verificar transiciones de estado (ej: `idle` -> `uploading` -> `success`).

### 3. Tests de Componentes (UI)

Verificamos que el componente renderice correctamente y reaccione a eventos de usuario.

- **Regla de Oro:** Probar comportamiento, no implementación.
- **Mocking:** Se deben mockear los hooks y servicios externos para aislar el componente.

### 4. Tests de Integración (Services)

Verificamos la comunicación entre nuestra lógica y servicios externos.

- **Enfoque:** Mockear el cliente (ej: Supabase) y asegurar que las llamadas se realizan con los parámetros y formatos correctos.

---

## 📜 Convenciones y Buenas Prácticas

1.  **Tipado Estricto:** Prohibido el uso de `any` en los tests. Usar `unknown` + casting a tipos reales o `ReturnType<typeof ...>` para mocks.
2.  **Limpieza:** Usar `beforeEach(() => vi.clearAllMocks())` para asegurar que los tests sean independientes.
3.  **Naming:** Los archivos deben terminar en `.test.ts` o `.test.tsx`.
4.  **Mocks Globales:** Los mocks de módulos externos recurrentes (`next/image`, `next/navigation`, `lucide-react`, `sileo`, `@clerk/nextjs`, `next-intl`) están centralizados en `vitest.setup.tsx`. No redeclarar estos mocks en archivos de test individuales (DRY).
5.  **Aislamiento:** Un test no debe depender de la ejecución de otro.

---

## 🚀 Ejecución de Tests

| Comando                 | Descripción                                   |
| :---------------------- | :-------------------------------------------- |
| `npm run test`          | Inicia Vitest en modo watch (desarrollo).     |
| `npm run test:ui`       | Vitest con interfaz interactiva en navegador. |
| `npm run test:run`      | Ejecuta todos los tests una sola vez (CI).    |
| `npm run test:coverage` | Genera reporte de cobertura en `/coverage`.   |
| `npm run test:e2e`      | Ejecuta los tests de Playwright.              |

---

## 🛡️ Infraestructura de Mocks

### Mocks centralizados en `vitest.setup.tsx`

Los módulos externos usados en múltiples tests están registrados una sola vez en `vitest.setup.tsx` (principio DRY). Los archivos de test no deben redeclarar estos mocks.

| Módulo            | Comportamiento por defecto                                                    |
| :---------------- | :---------------------------------------------------------------------------- |
| `next/image`      | `<img>` nativo con soporte de `onError`                                       |
| `next/navigation` | `useRouter` → `{ push: vi.fn() }`                                             |
| `lucide-react`    | `importOriginal` + `OctagonAlert` e `Info` con `data-testid`                  |
| `sileo`           | `{ success, error, warning, info }` como `vi.fn()`                            |
| `@clerk/nextjs`   | `useAuth: vi.fn().mockReturnValue({ userId: null, isLoaded: true })`          |
| `next-intl`       | `useTranslations` lee `messages/es.json` via `makeUseTranslations()`          |

### Control de `useAuth` por test

El mock global provee estado "no autenticado" por defecto. Para sobrescribirlo en un test concreto:

```typescript
import { useAuth } from '@clerk/nextjs'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuth).mockReturnValue({ userId: null, isLoaded: true } as never)
})

it('autoriza al usuario', () => {
  vi.mocked(useAuth).mockReturnValue({ userId: 'user_123' } as never)
  // ...
})
```

El cast `as never` es necesario porque `mockReturnValue` espera el tipo completo `UseAuthReturn` de Clerk. `never` es un tipo bottom que satisface cualquier tipo en TypeScript sin coste en runtime.

> `vi.clearAllMocks()` limpia el historial de llamadas pero **no** resetea `mockReturnValue`. Siempre resetear explícitamente al estado por defecto en `beforeEach`.

### Traducciones: `tests/mocks/intl.ts`

La función `makeUseTranslations()` lee `messages/es.json` directamente, garantizando que los textos en los tests estén siempre sincronizados con los de producción.

```typescript
// Uso directo (solo si necesitas resolver una clave manualmente):
import { makeUseTranslations } from '../../mocks/intl'
const t = makeUseTranslations()('Encyclopedia')
expect(t('monsterForm.namePlaceholder')).toBe('Nombre del monstruo')
```

Soporta dos patrones de namespace:
- Namespace simple + clave dotted: `useTranslations('Encyclopedia')` + `t('monsterForm.namePlaceholder')`
- Namespace dotted + clave simple: `useTranslations('Encyclopedia.listView')` + `t('searchPlaceholder')`

El mock de `next-intl` se registra globalmente desde `vitest.setup.tsx` — los tests no necesitan hacerlo manualmente.

### Prisma (ORM de servidor)

Cada test que necesita Prisma declara su propio mock al inicio del archivo:

```typescript
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    campaign: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}))
```
