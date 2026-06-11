import type { ReactDoctorConfig } from "react-doctor/api";

export default {
  ignore: {
    overrides: [
      // Estos archivos usan requireUserId() como wrapper de auth() de Clerk. La regla no reconoce abstracciones propias. Auditado manualmente.
      {
        files: [
          "src/views/campaigns/api/campaign-actions.ts",
          "src/views/campaigns/api/campaign-queries.ts",
          "src/views/encyclopedia/api/encyclopedia-actions.ts",
          "src/views/encyclopedia/api/encyclopedia-queries.ts"
        ],
        rules: [
          "react-doctor/server-auth-actions"
        ]
      },
      // deleteAssetSafe delega siempre en deleteAsset, que valida auth() de Clerk y lanza 'No autenticado' si no hay sesión. La regla no sigue llamadas a funciones internas del mismo módulo. Auditado manualmente.
      {
        files: [
          "src/shared/api/storage-actions.ts"
        ],
        rules: [
          "react-doctor/server-auth-actions"
        ]
      },
      // Mock de next/image para tests con jsdom: el <img> real es intencional para simular el componente en el DOM de prueba, no es código de producción.
      {
        files: [
          "vitest.setup.tsx"
        ],
        rules: [
          "react-doctor/nextjs-no-img-element"
        ]
      },
      // handleSubmit(onSubmit) de react-hook-form nunca invoca onSubmit durante el render, solo lo registra como event handler. Ya documentado con eslint-disable react-hooks/refs en la línea correspondiente.
      {
        files: [
          "src/views/encyclopedia/ui/monster-creation/MonsterForm.tsx"
        ],
        rules: [
          "react-hooks-js/refs"
        ]
      },
      // onRegisterCleanup es un registro imperativo de un callback de limpieza de assets (similar a useImperativeHandle), no sincronización de estado compartido entre padre e hijo.
      {
        files: [
          "src/views/encyclopedia/ui/monster-creation/MonsterForm.tsx"
        ],
        rules: [
          "react-doctor/no-pass-data-to-parent"
        ]
      },
      // useRef(new Set()) en pendingUrls: el coste de crear un Set vacío descartado en renders posteriores es despreciable. No justifica renombrar todas las referencias a pendingUrls.current para una inicialización perezosa.
      {
        files: [
          "src/views/encyclopedia/ui/monster-creation/MonsterForm.tsx"
        ],
        rules: [
          "react-doctor/rerender-lazy-ref-init"
        ]
      },
      // El botón de submit usa text-neutral-950 (#0a0a0a, casi negro) sobre bg-amber-600/80, con un contraste real de ~5.6:1 (cumple WCAG AA). La regla detecta cualquier clase text-neutral-* sobre fondo de color sin distinguir tonos claros de oscuros.
      {
        files: [
          "src/views/encyclopedia/ui/monster-creation/MonsterForm.tsx"
        ],
        rules: [
          "react-doctor/no-gray-on-colored-background"
        ]
      }
    ]
  }
} satisfies ReactDoctorConfig;
