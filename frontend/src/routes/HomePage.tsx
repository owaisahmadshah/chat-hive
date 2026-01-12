import { useState } from "react"

import useGetUserId from "@/hooks/useGetUser"
import ChatSection from "@/features/chat-section/ChatSection"
import MessageSection from "@/features/message-section/MessageSection"
import { useSocketService } from "@/hooks/useSocketService"
import usePresenceStatus from "@/hooks/usePresenceStatus"

const HomePage = () => {
  const [isChatSelected, setIsChatSelected] = useState(false)

  // Initialize essential hooks
  useGetUserId()
  useSocketService()
  usePresenceStatus()

  return (
    <main className="flex h-dvh overflow-hidden bg-background">
      <ChatSection value={isChatSelected} setValue={setIsChatSelected} />
      <MessageSection value={isChatSelected} setValue={setIsChatSelected} />
    </main>
  )
}

export default HomePage
