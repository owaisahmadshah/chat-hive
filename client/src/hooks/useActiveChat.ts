import { useSearchParams } from "react-router-dom";

export const useActiveChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const chatId = searchParams.get("chatId");
  const activeUserId = searchParams.get("userId");

  const openChat = (chatId: string, userId: string) => {
    setSearchParams({ chatId, userId });
  };

  const closeChat = () => {
    setSearchParams({});
  };

  return {
    chatId,
    activeUserId,
    isOpen: !!chatId && !!activeUserId,
    openChat,
    closeChat,
  };
};
