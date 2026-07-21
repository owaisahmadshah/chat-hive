import { Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ChatSection } from "@/features/chat/ChatSection";
import { useMobileHeight } from "@/hooks/useMobileHeight";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeChatId = searchParams.get("chatId");
  const activeChatUserId = searchParams.get("userId");

  useMobileHeight();

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

        {/* Message section placeholder */}
        <div
          className={cn(
            "flex-1 bg-background flex items-center justify-center text-muted-foreground",
            !activeChatId && "max-sm:hidden",
          )}
        >
          {/* Message view area - to be implemented */}
        </div>
      </Suspense>
    </main>
  );
};

export default HomePage;
