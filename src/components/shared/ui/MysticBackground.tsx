export function MysticBackground() {
  return (
    <div className='absolute inset-0 z-0 pointer-events-none w-full h-full' aria-hidden='true'>
      {/* Glow central */}
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full bg-indigo-900/10 blur-[150px] mix-blend-screen animate-pulse duration-10000' />

      {/* Glow secundario (ámbar) */}
      <div className='absolute top-1/3 left-1/4 w-[40vw] h-[40vh] rounded-full bg-amber-600/10 blur-[120px] mix-blend-plus-lighter' />
    </div>
  )
}
