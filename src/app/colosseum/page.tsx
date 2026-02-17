export default function ColosseumPage() {
  return (
    <div className="space-y-6 text-foreground">
      <h1 className="text-3xl font-bold border-b border-iron pb-4 text-torch">
        Bienvenido a la Arena
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder cards */}
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="dungeon-panel p-6 rounded-lg min-h-[200px] flex flex-col items-center justify-center border border-iron hover:border-torch transition-colors bg-stone/30">
            <span className="text-iron text-4xl mb-2">⚔️</span>
            <h3 className="text-lg font-semibold text-foreground">
              Desafío {i}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
