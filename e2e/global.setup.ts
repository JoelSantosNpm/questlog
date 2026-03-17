/**
 * Setup global de Playwright: se ejecuta UNA VEZ en Node.js antes de todos los tests.
 * Llama a clerkSetup() para que Clerk genere el CLERK_TESTING_TOKEN y CLERK_FAPI
 * usando la CLERK_SECRET_KEY del fichero .env.
 */
import { clerkSetup } from '@clerk/testing/playwright'

export default async function globalSetup() {
  await clerkSetup()
}
