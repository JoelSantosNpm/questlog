/**
 * Tests E2E del flujo de creación de templates de monstruos.
 *
 * Requisitos previos:
 *  - `npm run dev` corriendo en localhost:3000.
 *  - El proyecto "setup" (auth.setup.ts) debe ejecutarse antes de los tests autenticados.
 *  - Los tests de invitado usan storageState vacío (sin cookies de Clerk).
 */
import { expect, test } from '@playwright/test'

const URL = '/encyclopedia'

// ─── MC – Acceso al formulario ────────────────────────────────────────────────

test('MC-01 – el botón "Nuevo monstruo" abre el formulario de creación', async ({ page }) => {
  await page.goto(URL)

  await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

  await expect(page.getByPlaceholder('Nombre del monstruo')).toBeVisible({ timeout: 3000 })
})

test('MC-02 – el badge "Creando monstruo" es visible al entrar en modo creación', async ({
  page,
}) => {
  await page.goto(URL)
  await expect(page.getByRole('button', { name: 'Open user menu' })).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

  await expect(page.getByText('Creando monstruo')).toBeVisible({ timeout: 3000 })
})

test('MC-03 – el botón "Volver" cierra el formulario y devuelve la vista de lista', async ({
  page,
}) => {
  await page.goto(URL)
  await expect(page.getByRole('button', { name: 'Open user menu' })).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: 'Nuevo monstruo' }).click()
  await expect(page.getByPlaceholder('Nombre del monstruo')).toBeVisible()

  await page.getByRole('button', { name: 'Volver' }).click()

  await expect(page.getByPlaceholder('Nombre del monstruo')).not.toBeVisible({ timeout: 3000 })
  await expect(page.getByRole('button', { name: 'Nuevo monstruo' })).toBeVisible()
})

// ─── MC – Flujo de invitado (sin sesión) ──────────────────────────────────────

test.describe('Flujo de invitado (sin sesión)', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('MC-04 – al abrir el formulario sin sesión aparece el toast de aviso a invitados', async ({
    page,
  }) => {
    await page.goto(URL)
    // Esperar que Clerk determine el estado no-autenticado (isLoaded=true, userId=null)
    // antes de abrir el formulario, para que el useEffect del toast se dispare inmediatamente.
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible({
      timeout: 10000,
    })

    await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

    // El título del toast está en [data-sileo-title]
    await expect(page.locator('[data-sileo-title]', { hasText: 'No has iniciado sesión' })).toBeVisible({
      timeout: 5000,
    })
  })

  test('MC-05 – intentar guardar sin sesión muestra el toast de auth requerida', async ({
    page,
  }) => {
    await page.goto(URL)
    await expect(page.getByRole('button', { name: 'Iniciar sesión' })).toBeVisible({
      timeout: 10000,
    })

    await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

    await page.getByPlaceholder('Nombre del monstruo').fill('Intruso sin sesión')
    await page.locator('input[placeholder="Tipo"]').fill('Humanoide')
    await page.getByRole('button', { name: 'Crear monstruo' }).click()

    await expect(page.locator('[data-sileo-title]', { hasText: 'Sesión requerida' })).toBeVisible({
      timeout: 5000,
    })
  })
})

// ─── MC – Flujo de creación autenticado ───────────────────────────────────────

test('MC-06 – crear un monstruo con los campos mínimos muestra el toast de éxito', async ({
  page,
}) => {
  await page.goto(URL)
  // Esperar que Clerk confirme la sesión activa antes de interactuar con el formulario.
  await expect(page.getByRole('button', { name: 'Open user menu' })).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

  const name = `Bestia E2E ${Date.now()}`
  await page.getByPlaceholder('Nombre del monstruo').fill(name)
  await page.locator('input[placeholder="Tipo"]').fill('Bestia')
  await page.getByRole('button', { name: 'Crear monstruo' }).click()

  await expect(page.getByText('Monstruo creado')).toBeVisible({ timeout: 10000 })
})

test('MC-07 – tras crear el monstruo, su nombre aparece en la lista del bestiario', async ({
  page,
}) => {
  await page.goto(URL)
  // Esperar que Clerk confirme la sesión activa antes de interactuar con el formulario.
  await expect(page.getByRole('button', { name: 'Open user menu' })).toBeVisible({ timeout: 10000 })

  await page.getByRole('button', { name: 'Nuevo monstruo' }).click()

  const name = `Wyvern E2E ${Date.now()}`
  await page.getByPlaceholder('Nombre del monstruo').fill(name)
  await page.locator('input[placeholder="Tipo"]').fill('Dragón')
  await page.getByRole('button', { name: 'Crear monstruo' }).click()

  // Esperar toast de éxito y luego confirmar que el item aparece en la lista tras el refetch
  await expect(page.getByText('Monstruo creado')).toBeVisible({ timeout: 10000 })
  await expect(page.locator('button p.font-semibold', { hasText: name })).toBeVisible({
    timeout: 8000,
  })
})
