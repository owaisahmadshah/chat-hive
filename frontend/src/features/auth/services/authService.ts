import api from "@/lib/axiosInstance"
import { TSignUpSchema } from "../types/signUpSchema"
import { TResendOtp, TVerifyOtp } from "../types/otpSchema"
import { TSignInSchema } from "../types/signInSchema"

export const signUpService = async (data: TSignUpSchema) => {
  const response = await api.post("/v1/user/signup", data)
  return response.data
}

export const resendOtpService = async (data: TResendOtp) => {
  const response = await api.post("/v1/user/resend-otp", data)
  return response.data
}

export const verifyOtpService = async (data: TVerifyOtp) => {
  const response = await api.post("/v1/user/verify-otp", data)
  return response.data
}

export const signInService = async (data: TSignInSchema) => {
  const response = await api.post("/v1/user/sign-in", data)
  return response.data
}

export const uniqueUsername = async (data: { username: string }) => {
  const response = await api.get("/v1/user/unique-username", { params: data })
  return response.data
}

export const signUpDummyService = async () => {
  const response = await api.post("/v1/user/create-dummy")
  return response.data
}
