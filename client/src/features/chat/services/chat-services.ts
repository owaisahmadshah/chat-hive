import api from "@/lib/api";
import type { Chat, Pagination, ReqPagination } from "shared";

export const getFeedChatsServ = async (params: ReqPagination) => {
  const data = await api.get<Pagination<Chat>>("/api/v1/chats", { params });
  return data as unknown as Pagination<Chat>;
};

export const getChatByIdServ = async (chatId: string) => {
  const data = await api.get<Chat>(`/api/v1/chats/${chatId}`);
  return data;
};
