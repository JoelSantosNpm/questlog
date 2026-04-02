import { notFound } from 'next/navigation'
import { ImageUploadTestClient } from './ImageUploadTestClient'

export default function ImageUploadTestPage() {
  if (process.env.NODE_ENV === 'production') {
    notFound()
  }

  return <ImageUploadTestClient />
}
