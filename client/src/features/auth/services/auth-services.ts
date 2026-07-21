import api from "@/lib/api";
import type {
  CreateUser,
  LoginUser,
  NewPassword,
  ResendOTP,
  ResetPassword,
  VerifyOTP,
} from "shared";

export const signUpServ = async (data: CreateUser) => {
  return await api.post("/api/v1/auth/register", data);
};

export const signInServ = async (data: LoginUser) => {
  return await api.post("/api/v1/auth/login", data);
};

export const verifyOTPServ = async (data: VerifyOTP) => {
  return await api.post("/api/v1/auth/otp/verify", data);
};

export const resendOTPServ = async (data: ResendOTP) => {
  return await api.post("/api/v1/auth/otp/resend", data);
};

export const refreshTokenServ = async () => {
  return await api.post("/api/v1/auth/refresh-token");
};

export const logoutServ = async () => {
  return await api.delete("/api/v1/auth/logout");
};

export const logoutAll = async () => {
  return await api.delete("/api/v1/auth/logout/all");
};

export const logoutOthers = async () => {
  return await api.post("/api/v1/auth/logout/others");
};

export const newPasswordServ = async (data: NewPassword) => {
  return await api.patch("api/v1/auth/new-password", data);
};

export const forgotPasswordServ = async (data: ResendOTP) => {
  return await api.post("/api/v1/auth/forgot-password", data);
};

export const resetPasswordServ = async (data: ResetPassword) => {
  return await api.post("/api/v1/auth/reset-password", data);
};
