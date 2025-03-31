import { z } from "zod"

export const messageSchema = z.object({
  userInputMessage: z.string().trim(),
  uploadedImage: z.instanceof(FileList).optional(),
})
