import { z } from "zod"

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Password is atleast 8 characters long"),
  newPassword: z
    .string()
    .min(8, "New password must be atleast 8 characters long"),
})

export type TChangePassword = z.infer<typeof changePasswordSchema>
