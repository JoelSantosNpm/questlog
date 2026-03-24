'use client'

import { testSuccessToast, testErrorToast } from '@/lib/notifications'

export const ToastTester = () => {
  return (
    <div className='flex gap-4 p-4 rounded-xl border border-stone-800 bg-stone-900/40 mt-12'>
      <button
        onClick={testSuccessToast}
        className='rounded bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-500 border border-emerald-900/50 hover:bg-emerald-900/50 transition'
      >
        Probar Éxito
      </button>

      <button
        onClick={testErrorToast}
        className='rounded bg-red-900/30 px-4 py-2 text-sm font-semibold text-red-500 border border-red-900/50 hover:bg-red-900/50 transition'
      >
        Probar Error
      </button>
    </div>
  )
}
