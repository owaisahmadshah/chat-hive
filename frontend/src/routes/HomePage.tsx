import useGetUserId from "@/hooks/useGetUser"
import ChatSection from "@/features/chat-section/ChatSection"
import MessageSection from "@/features/message-section/MessageSection"
import usePresenceStatus from "@/hooks/usePresenceStatus"
import { useSearchParams } from "react-router-dom"
import { Suspense } from "react"
import { HomePageSkeleton } from "@/components/HomePageSkeleton"
import { useInitSocket } from "@/socket/hooks/useInitSocket"
import { useMobileHeight } from "@/hooks/useMobileHeight"

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeChatId = searchParams.get("chatId")
  const activeChatUserId = searchParams.get("userId")

  useMobileHeight()

  // Initialize essential hooks
  useGetUserId()
  useInitSocket()
  usePresenceStatus()

  const setSearchParamsWithChat = (args: {
    chatId: string | null
    userId: string | null
  }) => {
    const { chatId, userId } = args
    if (chatId && userId) {
      setSearchParams({ chatId, userId })
    } else {
      setSearchParams({})
    }
  }

  return (
    <main
      className="fixed inset-0 flex overflow-hidden bg-background"
      style={{ height: "var(--visual-height, 100dvh)" }}
    >
      <Suspense
        fallback={
          <HomePageSkeleton
            activeChatId={activeChatId}
            activeChatUserId={activeChatUserId}
          />
        }
      >
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
  )
}

export default HomePage
