import { ChatSectionSkeleton } from "@/features/chat/components/skeletons/ChatSectionSkeleton";
import { MessagesListSkeleton } from "@/features/messages/components/error-handlers/MessagesListSkeleton";
import { MessageInputSkeleton } from "@/features/messages/components/skeletons/MessageInputSkeleton";
import { MessageNavbarSectionSekeleton } from "@/features/messages/components/skeletons/MessageNavbarSkeleton";
import { cn } from "@/lib/utils";

export const HomePageSkeleton = () => {
  return (
    <div className="flex h-dvh overflow-hidden bg-background w-full">
      <ChatSectionSkeleton />
      <div
        className={cn(
          "grid h-[100dvh] w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)] max-sm:hidden",
        )}
      >
        <MessageNavbarSectionSekeleton />
        <MessagesListSkeleton />
        <MessageInputSkeleton />
      </div>
    </div>
  );
};
