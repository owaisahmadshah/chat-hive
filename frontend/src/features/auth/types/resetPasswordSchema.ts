import * as z from "zod"

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password is too short"),
    passwordConfirmation: z.string().min(6, "Confirmation required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  })
