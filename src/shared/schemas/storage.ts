import { z } from 'zod'

const MAX_FILE_SIZE = 600 * 1024 // 600kB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export const FileValidationSchema = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, 'fileTooLarge')
  .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), 'invalidFileType')

export type FileValidation = z.infer<typeof FileValidationSchema>
