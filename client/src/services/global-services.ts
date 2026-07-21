import api from "@/lib/api";
import { type User } from "shared";

export const userServ = async () => {
  const data = await api.get<User>("/api/v1/users/profile");
  return data as unknown as User;
};

export const userDeleteServ = async () => {
  return await api.delete("/api/v1/auth/logout/all");
};
