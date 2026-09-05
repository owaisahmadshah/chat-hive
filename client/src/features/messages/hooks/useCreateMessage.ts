import { useChatActions } from "@/hooks/useChatActions";
import type { CreateMessage, Message } from "shared";

interface UseCreateMessage {
  message: Message | null;
  error: string | null;
}

export const useCreateMessage = () => {
  const { createMessage } = useChatActions();

  return async (data: CreateMessage): Promise<UseCreateMessage> => {
    try {
      const response = await createMessage(data);
      // TODO: Add to messages
      return { message: response, error: null };
    } catch (error) {
      console.error(error);
      return { message: null, error: "Unable to send message" };
    }
  };
};
