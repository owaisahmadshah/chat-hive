import axios from "axios"

import { TSignUpSchema } from "../types/signUpSchema"
import { TSignInSchema } from "../types/signInSchema"
import {
  TResendOtp,
  TVerifyAndResetOtpServer,
  TVerifyOtp,
} from "../types/otpSchema"

import {
  resendOtpService,
  signInService,
  signUpService,
  uniqueUsername,
  verifyOtpService,
} from "../services/authService"

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useAuth = () => {
  const signUp = async (
    signUpData: TSignUpSchema
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      const data = await signUpService(signUpData)

      if (data.status < 200 || data.status >= 300) {
        throw new Error("Unexpected server response")
      }

      return { success: true }
    } catch (err) {
      // console.error("Error while sign up", err)

      let normalizedError = "Something went wrong"
      if (axios.isAxiosError(err)) {
        normalizedError = err.response?.data.message ?? err.message
        // console.error("Axios error details:", normalizedError)
      }

      return { success: false, error: normalizedError }
    }
  }

  const signIn = async (
    signInData: TSignInSchema
  ): Promise<{ success: boolean; isVerified: boolean; error?: any }> => {
    try {
      await signInService(signInData)

      return { success: true, isVerified: true, error: null }
    } catch (err) {
      let normalizedError = "Something went wrong"
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          return { success: false, isVerified: false }
        }
        normalizedError = err.response?.data.message ?? err.message
      }

      return { success: false, isVerified: false, error: normalizedError }
    }
  }

  const verifyOtp = async (
    otpData: TVerifyOtp
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      await verifyOtpService(otpData)
      return { success: true, error: null }
    } catch (err) {
      let normalizedError = "Something went wrong"
      if (axios.isAxiosError(err)) {
        normalizedError = err.response?.data.message ?? err.message
      }

      return { success: false, error: normalizedError }
    }
  }

  const resendOtp = async (
    otpData: TResendOtp
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      await resendOtpService(otpData)
      return { success: true, error: null }
    } catch (err) {
      let normalizedError = "Something went wrong"
      if (axios.isAxiosError(err)) {
        normalizedError = err.response?.data.message ?? err.message
      }

      return { success: false, error: normalizedError }
    }
  }

  const forgetPassword = async (
    otpData: TVerifyAndResetOtpServer
  ): Promise<{ success: boolean; error?: any }> => {
    try {
      await verifyOtpService(otpData)

      return { success: true, error: null }
    } catch (err) {
      let normalizedError = "Something went wrong"
      if (axios.isAxiosError(err)) {
        normalizedError = err.response?.data.message ?? err.message
      }

      return { success: false, error: normalizedError }
    }
  }

  const uniqueUserUsername = async (username: string): Promise<boolean> => {
    try {
      const data = await uniqueUsername({ username })

      return data.data.isUnique
    } catch (error) {
      console.error(error)
      return false
    }
  }

  return {
    signUp,
    signIn,
    verifyOtp,
    resendOtp,
    forgetPassword,
    uniqueUserUsername,
  }
}
