import { getTranslations } from 'next-intl/server'

export default async function ColosseumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const t = await getTranslations('Colosseum.sidebar')
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <aside className="dungeon-panel w-[300px] flex-shrink-0 overflow-y-auto p-4 border-r border-iron bg-stone/20 backdrop-blur-sm">
        <nav className="flex flex-col gap-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-torch uppercase tracking-wider pl-2 border-l-2 border-torch">
              {t('heading')}
            </h2>
            <p className="text-xs text-iron pl-2 mt-1">{t('subtitle')}</p>
          </div>

          <div className="space-y-2">
            {/* Aquí irían los enlaces de navegación, simulados por ahora */}
            <div className="p-2 hover:bg-white/5 rounded cursor-pointer transition-colors text-sm text-foreground/80 hover:text-torch">
              {t('nav.overview')}
            </div>
            <div className="p-2 hover:bg-white/5 rounded cursor-pointer transition-colors text-sm text-foreground/80 hover:text-torch">
              {t('nav.gladiators')}
            </div>
            <div className="p-2 hover:bg-white/5 rounded cursor-pointer transition-colors text-sm text-foreground/80 hover:text-torch">
              {t('nav.tournaments')}
            </div>
          </div>
        </nav>
      </aside>

      {/* Contenido Principal - Arena */}
      <main className="flex-1 overflow-y-auto p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900/50 via-background to-background pointer-events-none -z-10" />
        {children}
      </main>
    </div>
  );
}
