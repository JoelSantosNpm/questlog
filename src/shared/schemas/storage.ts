import { z } from 'zod'

const MAX_FILE_SIZE = 600 * 1024 // 600kB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const FileValidationSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, `El archivo supera el tamaño máximo de 600kB.`)
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Solo se aceptan archivos .jpg, .jpeg, .png y .webp'
  )

export type FileValidation = z.infer<typeof FileValidationSchema>
