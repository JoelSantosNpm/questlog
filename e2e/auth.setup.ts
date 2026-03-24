/**
 * Setup de autenticación de Playwright: se ejecuta como proyecto "setup" antes de
 * los tests que requieren auth. Firma con Clerk via backend (sin password) usando
 * CLERK_SECRET_KEY + E2E_CLERK_USER_EMAIL y guarda el estado del navegador en
 * e2e/.auth/user.json para reutilizarlo en los tests.
 *
 * Variables de entorno necesarias (añadir a .env):
 *   E2E_CLERK_USER_EMAIL=<email del usuario de prueba en Clerk>
 */
import { clerk } from '@clerk/testing/playwright'
import { test as setup } from '@playwright/test'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const authFile = path.join(__dirname, '.auth/user.json')

setup('autenticar usuario de prueba', async ({ page }) => {
  // La home (/) es pública y carga el JS de Clerk — necesario antes de signIn
  await page.goto('/')

  await clerk.signIn({
    page,
    emailAddress: process.env.E2E_CLERK_USER_EMAIL!,
  })

  // Persistir cookies y localStorage para reutilizarlos en todos los tests
  await page.context().storageState({ path: authFile })
})
