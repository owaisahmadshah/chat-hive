import { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatSection } from "@/features/chat/ChatSection";
import { useMobileHeight } from "@/hooks/useMobileHeight";
import MessageSection from "@/features/messages/MessageSection";
import { useInitSocketEvents } from "@/hooks/useInitSocketEvents";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChatId = searchParams.get("chatId");
  const activeChatUserId = searchParams.get("userId");

  useMobileHeight();
  useInitSocketEvents();

  const setSearchParamsWithChat = (args: {
    chatId: string | null;
    userId: string | null;
  }) => {
    const { chatId, userId } = args;
    if (chatId && userId) {
      setSearchParams({ chatId, userId });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main
      className="fixed inset-0 flex overflow-hidden bg-background"
      style={{ height: "var(--visual-height, 100dvh)" }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <ChatSection
          activeChatId={activeChatId}
          activeChatUserId={activeChatUserId}
          action={setSearchParamsWithChat}
        />

        <MessageSection
          activeChatId={activeChatId}
          activeChatUserId={activeChatUserId}
          backAction={() => setSearchParams({})}
        />
      </Suspense>
    </main>
  );
};

export default HomePage;
