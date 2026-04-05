import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import { useSearchParams } from "react-router-dom"
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

interface IMessageSectionProps {
  backAction: () => void
  value: boolean
}

const MessageSection = ({ backAction, value }: IMessageSectionProps) => {
  const [params] = useSearchParams()

  const activeChatId = params.get("chatId")
  const activeChatUserId = params.get("userId")

  const userId = useSelector((state: RootState) => state.user.userId)

  useUserOnlineStatus()

  if (activeChatId === null || activeChatUserId === null) {
    return <NoChatSelected />
  }

  return (
    <section
      className={cn(
        "grid h-[100dvh] w-full grid-rows-[auto_1fr_auto] bg-background pt-[env(safe-area-inset-top)]",
        value ? "" : "max-sm:hidden"
      )}
    >
      <ErrorBoundary FallbackComponent={MessageNavbarErrorHandler}>
        <Suspense fallback={<MessageNavbarSectionSekeleton />}>
          <MessageNavbarSection
            backAction={backAction}
            activeChatUserId={activeChatUserId}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary FallbackComponent={MessagesListSkeleton}>
        <Suspense fallback={<MessagesListSkeleton />}>
          <MessagesList
            activeChatId={activeChatId}
            activeChatUserId={activeChatUserId}
          />
        </Suspense>
      </ErrorBoundary>

      <MessageInput activeChatId={activeChatId} userId={userId} />
    </section>
  )
}

export default MessageSection
