import { z } from "zod"

export const messageSchema = z.object({
  userInputMessage: z.string().trim(),
  // picture: z.instanceof(FileList).optional(),
})
