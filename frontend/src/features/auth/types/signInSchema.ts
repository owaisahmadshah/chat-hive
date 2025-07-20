import * as z from "zod"

export const signInSchema = z.object({
  identifier: z.string().min(1, { message: "Email or username required." }),
  password: z
    .string()
    .min(1, { message: "Password required." })
    .min(8, { message: "Password must contain atleast 8 character." }),
})

export type TSignInSchema = z.infer<typeof signInSchema>
