'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className='flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white'>
        <h2 className='mb-4 text-2xl font-bold text-amber-500'>Something went wrong!</h2>
        <p className='mb-8 text-zinc-400'>{error.message}</p>
        <button
          className='rounded bg-amber-600 px-4 py-2 font-bold text-white hover:bg-amber-700 transition-colors'
          onClick={() => reset()}
        >
          Try again
        </button>
      </body>
    </html>
  )
}
