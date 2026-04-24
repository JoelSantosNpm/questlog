/**
 * Tests E2E del Portal de Piedra (El Sistema de Gestión de Campañas).
 *
 * Requisitos previos:
 *  - `npm run dev` corriendo en localhost:3000, O el webServer de playwright.config.ts lo levanta.
 *  - Variables de entorno en .env: E2E_CLERK_USER_EMAIL, CLERK_SECRET_KEY.
 *  - El usuario E2E debe existir en Clerk Y en la base de datos (ejecutar la app una vez para el lazy sync).
 */
import { test, expect } from '@playwright/test'

const CAROUSEL_LABEL = 'Selector de Campañas'

// ─── AC 3.1 ──────────────────────────────────────────────────────────────────
test('AC 3.1 – la Home muestra la marca y /campaigns renderiza el Portal de Piedra', async ({ page }) => {
  // 1. Verificar Home (Public)
  await page.goto('/')
  const mainHeading = page.getByRole('main').getByRole('heading', { name: 'Questlog' })
  await expect(mainHeading).toBeVisible()

  // 2. Verificar Salón de los Portales (Protected)
  await page.goto('/campaigns')
  const hallOfPortals = page.getByRole('region', { name: CAROUSEL_LABEL })
  await expect(hallOfPortals).toBeVisible()
})

// ─── AC 3.2 ──────────────────────────────────────────────────────────────────
test('AC 3.2 – navega el carrusel con los controles de flecha', async ({ page }) => {
  await page.goto('/campaigns')

  const carousel = page.getByRole('region', { name: CAROUSEL_LABEL })
  await expect(carousel).toBeVisible()

  const prevBtn = page.getByRole('button', { name: 'Previous campaign' })
  const nextBtn = page.getByRole('button', { name: 'Next campaign' })

  // Navegar hacia adelante y atrás
  await nextBtn.click()
  await expect(carousel).toBeVisible()

  await prevBtn.click()
  await expect(carousel).toBeVisible()

  // Navegación por teclado (accesibilidad)
  await carousel.press('ArrowRight')
  await carousel.press('ArrowLeft')
  await expect(carousel).toBeVisible()
})

// ─── AC 3.3 ──────────────────────────────────────────────────────────────────
test('AC 3.3 – flujo completo: crear campaña y verificar que aparece en el carrusel', async ({
  page,
}) => {
  const campaignName = `Portal E2E ${Date.now()}`

  // 1. Ir al Portal de Piedra y verificar que NO redirige a login
  await page.goto('/campaigns')
  await expect(page).not.toHaveURL(/.*sign-in.*/)
  
  const carousel = page.getByRole('region', { name: CAROUSEL_LABEL })
  await expect(carousel).toBeVisible({ timeout: 10000 })

  // 2. Navegar al último portal del carrusel ("Nueva Aventura") usando el último dot indicator
  const dotButtons = page.locator('button[aria-label^="Go to campaign"]')
  await dotButtons.last().click()

  // 3. Esperar que "Crear nueva aventura" sea el portal activo y hacer click
  const newCampaignLink = page.getByRole('link', { name: 'Crear nueva aventura' })
  await expect(newCampaignLink).toBeVisible({ timeout: 5000 })
  await newCampaignLink.click()
  await page.waitForURL('**/campaigns/creation')

  // 4. Paso 1 del wizard: nombre de campaña (campo obligatorio)
  const nameInput = page.getByPlaceholder('el nombre de tu gesta')
  await expect(nameInput).toBeVisible()
  await nameInput.fill(campaignName)
  await page.getByRole('button', { name: 'Continuar' }).click()

  // 5. Paso 2 del wizard: localización (opcional)
  //    La transición tarda ~2600ms; esperamos el botón "Abrir Portal"
  const submitBtn = page.getByRole('button', { name: 'Abrir Portal' })
  await expect(submitBtn).toBeVisible({ timeout: 5000 })
  await page.getByPlaceholder('punto de partida (ej: la Ciudad de Neverwinter)').fill('Neverwinter')
  
  // 6. Al hacer click, esperamos el Toast de Sileo para confirmar el éxito antes de la redirección
  await submitBtn.click()
  
  // Verificar Toast de éxito (Sileo)
  const successToast = page.locator('text=Portal Esculpido')
  const errorToast = page.locator('text=Fallo al esculpir')
  
  await Promise.race([
    expect(successToast).toBeVisible({ timeout: 15000 }),
    expect(errorToast).toBeVisible({ timeout: 15000 }).then(() => {
      throw new Error('La creación de la campaña falló según el Toast de Sileo')
    })
  ])

  // 7. Después del submit exitoso, la Server Action redirige a /campaigns/{id}
  await page.waitForURL(/\/campaigns\/[a-zA-Z0-9_-]+$/, { timeout: 15000 })

  // 8. Volver al Portal de Piedra y verificar que la nueva campaña aparece en el carrusel
  await page.goto('/campaigns', { waitUntil: 'networkidle' })
  
  // Verificamos que el enlace con el aria-label correcto esté presente
  const portalLink = page.locator(`a[aria-label*="${campaignName}"]`)
  
  // expect.toBeAttached tiene reintentos internos incorporados (5s por defecto, extendemos a 10s)
  try {
    await expect(portalLink).toBeAttached({ timeout: 10000 })
  } catch (e) {
    console.log('DEBUG E2E: No encontrado al primer intento en el carrusel. Recargando...')
    await page.reload({ waitUntil: 'networkidle' })
    await expect(portalLink).toBeAttached({ timeout: 15000 })
  }

  // Verificamos que sea visible (Framer Motion habrá terminado la animación de entrada)
  await expect(portalLink).toBeVisible({ timeout: 10000 })
})
