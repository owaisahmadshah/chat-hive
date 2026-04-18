import { ChatSectionSkeleton } from "@/features/chat-section/Components/skeleton/ChatSectionSkeleton"
import { MessageInputSkeleton } from "@/features/message-section/components/Skeleton/MessageInputSkeleton"
import { MessageNavbarSectionSekeleton } from "@/features/message-section/components/Skeleton/MessageNavbarSectionSekeleton"
import { MessagesListSkeleton } from "@/features/message-section/components/Skeleton/MessagesListSkeleton"
import { cn } from "@/lib/utils"

export const HomePageSkeleton = () => {
  return (
    <div className="flex h-dvh overflow-hidden bg-background w-full">
      <ChatSectionSkeleton />
      <div
        className={cn(
          "grid h-[100dvh] w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)] max-sm:hidden"
        )}
      >
        <MessageNavbarSectionSekeleton />
        <MessagesListSkeleton />
        <MessageInputSkeleton />
      </div>
    </div>
  )
}
