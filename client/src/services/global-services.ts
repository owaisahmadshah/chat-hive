import api from "@/lib/api";
import { type ImageURLUpdate, type User } from "shared";

export const userServ = async () => {
  const data = await api.get<User>("/api/v1/users/profile");
  return data as unknown as User;
};

export const chatUserServ = async (id: string) => {
  const data = await api.get<User>(`/api/v1/users/profile/${id}`);
  return data as unknown as User;
};

export const userDeleteServ = async () => {
  return await api.delete("/api/v1/auth/logout/all");
};

export const profileImageUrlServ = async (payload: ImageURLUpdate) => {
  const data = await api.patch<User>("/api/v1/users/image-url", payload);
  return data as unknown as User;
};
