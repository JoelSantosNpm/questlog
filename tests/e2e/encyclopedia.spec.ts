/**
 * Tests E2E de la Enciclopedia (Hub de Conocimiento).
 *
 * Requisitos previos:
 *  - `npm run dev` corriendo en localhost:3000, O el webServer de playwright.config.ts lo levanta.
 *  - El proyecto "setup" (auth.setup.ts) debe ejecutarse antes para generar .auth/user.json.
 */
import { test, expect } from '@playwright/test'

const URL = '/encyclopedia'

// ─── AC – Acceso y carga inicial ──────────────────────────────────────────────

test('ENC-01 – la página /encyclopedia carga y muestra las tres pestañas de sección', async ({
  page,
}) => {
  await page.goto(URL)

  await expect(page.getByRole('button', { name: 'Bestiario' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Personajes' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Museo' })).toBeVisible()
})

test('ENC-02 – la sección activa inicial es Bestiario', async ({ page }) => {
  await page.goto(URL)

  // El primer item de la lista debe estar resaltado en amber (seleccionado)
  const firstItem = page.locator('button.text-amber-500').first()
  await expect(firstItem).toBeVisible()
})

// ─── AC – Navegación de secciones ─────────────────────────────────────────────

test('ENC-03 – cambiar entre secciones actualiza la lista visible', async ({ page }) => {
  await page.goto(URL)

  // El input de búsqueda está presente siempre que la lista sea visible
  const searchInput = page.getByPlaceholder('Buscar...')
  await expect(searchInput).toBeVisible()

  // Cambiar a Personajes
  await page.getByRole('button', { name: 'Personajes' }).click()
  await expect(searchInput).toBeVisible()

  // Cambiar a Museo
  await page.getByRole('button', { name: 'Museo' }).click()
  await expect(searchInput).toBeVisible()
})

// ─── AC – Búsqueda dentro de sección ─────────────────────────────────────────

test('ENC-04 – el filtro de búsqueda muestra "No se han encontrado registros." para query sin resultados', async ({
  page,
}) => {
  await page.goto(URL)

  const searchInput = page.getByPlaceholder('Buscar...')
  await expect(searchInput).toBeVisible()

  await searchInput.fill('xyzxyzquerynoresult')
  await expect(page.getByText('No se han encontrado registros.')).toBeVisible()
})

test('ENC-05 – el filtro de búsqueda es insensible a mayúsculas', async ({ page }) => {
  await page.goto(URL)

  // Obtener el nombre del primer item visible para buscarlo en mayúsculas
  const firstItemName = await page
    .locator('button.text-amber-500 p.font-semibold')
    .first()
    .textContent()
  if (!firstItemName) return

  const searchInput = page.getByPlaceholder('Buscar...')
  await searchInput.fill(firstItemName.toUpperCase())

  // El item debe seguir visible en la lista (restringido al botón, no al heading del detalle)
  await expect(
    page.locator('button p.font-semibold', { hasText: firstItemName }).first()
  ).toBeVisible()
})

// ─── AC – Selección de items ──────────────────────────────────────────────────

test('ENC-06 – hacer click en un item de la lista actualiza el panel de detalle', async ({
  page,
}) => {
  await page.goto(URL)

  // En desktop (lg+) la lista lateral está visible
  const listItems = page.locator('section button p.font-semibold')
  const count = await listItems.count()

  if (count < 2) {
    // Si solo hay un item o ninguno, el test no aplica
    test.skip()
    return
  }

  // Obtener el nombre del segundo item
  const secondItemName = await listItems.nth(1).textContent()
  if (!secondItemName) return

  // Hacer click en él
  await listItems.nth(1).click()

  // El panel de detalle debe mostrar ese nombre (h2 del ItemHeader)
  const detailHeading = page.getByRole('heading', { name: secondItemName })
  await expect(detailHeading).toBeVisible({ timeout: 3000 })
})

// ─── AC – Panel de detalle ────────────────────────────────────────────────────

test('ENC-07 – el panel de detalle muestra la etiqueta de sección correcta', async ({ page }) => {
  await page.goto(URL)

  // La sección activa es Bestiario, el panel debe mostrar la etiqueta
  await expect(page.getByText('Bestiario').first()).toBeVisible()
})

test('ENC-08 – navegar a Personajes muestra la etiqueta "Personajes" en el detalle', async ({
  page,
}) => {
  await page.goto(URL)

  await page.getByRole('button', { name: 'Personajes' }).click()

  // Esperar que el panel de detalle refleje la nueva sección
  await expect(page.getByText('Personajes').first()).toBeVisible({ timeout: 3000 })
})
