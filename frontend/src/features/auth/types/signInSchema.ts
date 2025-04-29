import * as z from "zod"

export const signInSchema = z
  .object({
    email: z.string().min(1, { message: "Email required." }).email(),
    password: z
      .string()
      .min(1, { message: "Password required." })
      .min(8, { message: "Password must contain atleast 8 character." }),
  })
