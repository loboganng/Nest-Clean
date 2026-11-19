import { z } from 'zod'
import { ZodValidationPipe } from './zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().int().min(1))

export type PageQueryParam = z.infer<typeof pageQueryParamSchema>

export const pageQueryValidationPipe = new ZodValidationPipe(
  pageQueryParamSchema,
)
