import api from "@/lib/api";
import type {
  Chat,
  DeleteChat,
  Pagination,
  ReqPagination,
  UserSummary,
} from "shared";

export const getFeedChatsServ = async (params: ReqPagination) => {
  const data = await api.get<Pagination<Chat>>("/api/v1/chats", { params });
  return data as unknown as Pagination<Chat>;
};

export const getChatByIdServ = async (chatId: string) => {
  const data = await api.get<Chat>(`/api/v1/chats/${chatId}`);
  return data;
};

export const getUsersByUsernameServ = async (
  username: string,
  params: ReqPagination,
) => {
  const data = await api.get<Pagination<UserSummary>>(
    `/api/v1/users/${username}`,
    {
      params,
    },
  );
  return data as unknown as Pagination<UserSummary>;
};

export const deleteChatByIdServ = async (data: DeleteChat) => {
  const response = await api.delete(`/api/v1/chats/${data.chatId}`);
  return response as unknown as { chatId: string; message: string };
};
