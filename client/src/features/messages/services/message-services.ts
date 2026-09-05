import api from "@/lib/api";
import type { Message, Pagination, ReqPagination } from "shared";

export const deleteMessageServ = async (messageId: string) => {
  const response = await api.delete(`/api/v1/messages/${messageId}`);
  return response;
};

export const getInfiniteChatMessagesServ = async (
  data: { chatId: string } & ReqPagination,
) => {
  const { chatId, ...pagination } = data;
  const response = await api.get<Pagination<Message>>(
    `/api/v1/messages/all/${chatId}`,
    {
      params: pagination,
    },
  );
  return response as unknown as Pagination<Message>;
};
