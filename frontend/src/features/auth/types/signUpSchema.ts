import * as z from "zod"

export const signUpSchema = z
  .object({
    email: z.string().min(1, { message: "Email required." }).email(),
    username: z.string().min(1, { message: "Username required." }),
    password: z
      .string()
      .min(1, { message: "Password required." })
      .min(8, { message: "Password must contain atleast 8 character." }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match.",
    path: ["passwordConfirmation"],
  })

export type TSignUpSchema = z.infer<typeof signUpSchema>