import { AUTH_ROUTES } from '@/config/routes/auth'
import { darkTheme } from '@/config/clerk-theme'
import { ClerkProvider } from '@clerk/nextjs'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={darkTheme}
      signInUrl={AUTH_ROUTES.signIn}
      signUpUrl={AUTH_ROUTES.signUp}
      afterSignOutUrl={AUTH_ROUTES.signIn}
      signInFallbackRedirectUrl={AUTH_ROUTES.afterSignIn}
      signUpFallbackRedirectUrl={AUTH_ROUTES.afterSignUp}
    >
      {children}
    </ClerkProvider>
  )
}
