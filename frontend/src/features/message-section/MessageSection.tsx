import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSelector } from "react-redux"

import { cn } from "@/lib/utils"
import { RootState } from "@/store/store"
import useUserOnlineStatus from "./hooks/useUserOnlineStatus"

import { MessagesList } from "./components/MessagesList"
import { MessageInput } from "./components/MessageInput"
import { NoChatSelected } from "./components/NoChatSelected"
import { MessageNavbarSection } from "./components/MessageNavbarSection"
import { MessagesListSkeleton } from "./components/Skeleton/MessagesListSkeleton"
import { MessageNavbarSectionSekeleton } from "./components/Skeleton/MessageNavbarSectionSekeleton"
import { MessageNavbarErrorHandler } from "./components/ErrorHandlers/MessageNavbarErrorHandler"
import { MessageInputSkeleton } from "./components/Skeleton/MessageInputSkeleton"
import { MessagesListErrorHandler } from "./components/ErrorHandlers/MessagesListErrorHandler"

interface IMessageSectionProps {
  activeChatId: string | null
  activeChatUserId: string | null
  backAction: () => void
}

const MessageSection = (props: IMessageSectionProps) => {
  const { activeChatId, activeChatUserId, backAction } = props

  const userId = useSelector((state: RootState) => state.user.userId)

  useUserOnlineStatus()

  if (activeChatId === null || activeChatUserId === null) {
    return <NoChatSelected />
  }

  return (
    <section
      className={cn(
        // "grid h-[100dvh] w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)]",
        "grid w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)]",
        !activeChatId && !activeChatUserId && "max-sm:hidden"
      )}
    >
      <ErrorBoundary FallbackComponent={MessageNavbarErrorHandler}>
        <Suspense fallback={<MessageNavbarSectionSekeleton />}>
          <MessageNavbarSection
            activeChatUserId={activeChatUserId}
            backAction={backAction}
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
            activeChatUserId={activeChatUserId}
          />

          <MessageInput activeChatId={activeChatId} userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </section>
  )
}

export default MessageSection
