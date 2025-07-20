import * as z from "zod"

export const verifyOtpSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  otpCode: z.string().length(6),
})

export const verifyAndResetOtpAndResetServerSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
  otpCode: z.string().length(6),
  password: z.string().min(8),
})

export const resendOtpSchema = z.object({
  identifier: z.string().min(1, "Identifier is required"),
})

export type TVerifyOtp = z.infer<typeof verifyOtpSchema>
export type TVerifyAndResetOtpServer = z.infer<typeof verifyAndResetOtpAndResetServerSchema>
export type TResendOtp = z.infer<typeof resendOtpSchema>
