import { Almendra, Inter, MedievalSharp } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'] })

export const medieval = MedievalSharp({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-medieval',
})

export const almendra = Almendra({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-almendra',
})
