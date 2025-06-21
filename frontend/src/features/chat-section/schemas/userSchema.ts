import { z } from "zod"

export const aboutSchema = z.object({
  field: z.string(),
  fieldValue: z.string().min(1, "About must contain atleast 4 characters"),
})

export const showFieldsSchema = z.object({
  field: z.string(),
  fieldValue: z.enum(["contacts", "public", "private"]),
})

export const readReceipts = z.object({
  field: z.string(),
  fieldValue: z.boolean(),
})

export type TUpdateUserField =
  | z.infer<typeof readReceipts>
  | z.infer<typeof showFieldsSchema>
  | z.infer<typeof aboutSchema>
