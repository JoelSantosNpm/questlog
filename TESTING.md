# Estrategia de Testing - Questlog

Este documento describe las prácticas, herramientas y organización del sistema de pruebas de Questlog.

## 🛠️ Stack de Testing

- **Unit/Integration:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).
- **E2E:** [Playwright](https://playwright.dev/).
- **Mocks:** Vitest `vi` para servicios y módulos externos.
- **Coverage:** `@vitest/coverage-v8`.

> **Tests actuales:** 99 tests unitarios pasando (6 carousel utils, 3 storage service, 4 storage schema, 6 useImageUploader, 4 ImageUploader UI, 6 CampaignCreationForm, 9 encyclopediaStore, 17 image-fallbacks, 12 ListView, 22 ItemHeader, 10 EncyclopediaImage) + 11 E2E pasando (3 portal-de-piedra, 8 encyclopedia).

---

## 📂 Organización de Archivos

Adoptamos una estructura centralizada en la carpeta raíz `tests/` para maximizar la escalabilidad y mantener la raíz del proyecto limpia.

```text
tests/
├── features/    # Tests organizados por funcionalidad (Unit/Integration/UI)
│   ├── campaigns/
│   │   └── components/CampaignCreationForm.test.tsx
│   ├── encyclopedia/
│   │   ├── lib/image-fallbacks.test.ts
│   │   ├── model/encyclopediaStore.test.ts
│   │   └── ui/
│   │       ├── ListView.test.tsx
│   │       ├── ItemHeader.test.tsx
│   │       └── EncyclopediaImage.test.tsx
│   ├── storage/
│   │   ├── components/ImageUploader.test.tsx
│   │   ├── hooks/useImageUploader.test.ts
│   │   ├── schemas/storage-schema.test.ts
│   │   └── services/storage-service.test.ts
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
4.  **Mocks Globales:** Configurar mocks recurrentes (Clerk, Sileo) en la parte superior del archivo para mantener los tests limpios.
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

## 🛡️ Infraestructura de Mocks Comunes

### Clerk (Autenticación)

```typescript
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(() => ({
    userId: 'mock-user',
    getToken: vi.fn().mockResolvedValue('token'),
  })),
}))
```

### Supabase (Base de datos)

```typescript
vi.mock('@/shared/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: mockData, error: null }),
  })),
}))
```

### Sileo (Notificaciones)

```typescript
vi.mock('sileo', () => ({
  sileo: { success: vi.fn(), error: vi.fn() },
}))
```
