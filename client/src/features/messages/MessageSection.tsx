import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useUser } from "@/context/user-context";
import { cn } from "@/lib/utils";

import { MessagesList } from "./components/MessagesList";
import { MessageNavbarSection } from "./components/MessageNavbarSection";
import { MessagesListErrorHandler } from "./components/error-handlers/MessageListErrorHandler";
import { NoChatSelected } from "./components/NoChatSelected";
import { MessagesListSkeleton } from "./components/error-handlers/MessagesListSkeleton";
import { MessageInputSkeleton } from "./components/skeletons/MessageInputSkeleton";
import { MessageNavbarErrorHandler } from "./components/error-handlers/MessageNavbarErrorHandler";
import { MessageNavbarSectionSekeleton } from "./components/skeletons/MessageNavbarSkeleton";
import { MessageInput } from "./components/MessageInput";

interface IMessageSectionProps {
  activeChatId: string | null;
  activeChatUserId: string | null;
  backAction: () => void;
}

const MessageSection = ({
  activeChatId,
  activeChatUserId,
  backAction,
}: IMessageSectionProps) => {
  const { state } = useUser();
  const currentUserId = state.user?.id;

  const handleDeleteChat = async () => {
    backAction();
  };

  if (!activeChatId || !activeChatUserId) {
    return <NoChatSelected />;
  }

  return (
    <section
      className={cn(
        "grid w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)]",
        "h-full overflow-hidden",
        !activeChatId && !activeChatUserId && "max-sm:hidden",
      )}
    >
      <ErrorBoundary FallbackComponent={MessageNavbarErrorHandler}>
        <Suspense fallback={<MessageNavbarSectionSekeleton />}>
          <MessageNavbarSection
            activeChatUserId={activeChatUserId}
            backAction={backAction}
            deleteChat={handleDeleteChat}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={MessagesListErrorHandler}>
        <Suspense
          fallback={
            <>
              <MessagesListSkeleton />
              <MessageInputSkeleton />
            </>
          }
        >
          <MessagesList
            activeChatId={activeChatId}
            currentUserId={currentUserId}
          />

          <MessageInput
            activeChatId={activeChatId}
            userId={currentUserId ?? ""}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default MessageSection;
