import useGetUserId from "@/hooks/useGetUser"
import ChatSection from "@/features/chat-section/ChatSection"
import MessageSection from "@/features/message-section/MessageSection"
import { useSocketService } from "@/hooks/useSocketService"
import usePresenceStatus from "@/hooks/usePresenceStatus"
import { useSearchParams } from "react-router-dom"

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const activeChatId = searchParams.get("chatId")
  const activeChatUserId = searchParams.get("userId")

  // Initialize essential hooks
  useGetUserId()
  useSocketService()
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
    <main className="flex h-dvh overflow-hidden bg-background">
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
    </main>
  )
}

export default HomePage
