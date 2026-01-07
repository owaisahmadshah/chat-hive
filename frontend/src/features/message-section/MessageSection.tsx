import NoChatSelected from "./components/NoChatSelected"
import MessageNavBar from "@/features/message-section/components/MessageNavBar"
import MessageInput from "@/features/message-section/components/MessageInput"
import { cn } from "@/lib/utils"
import { useSearchParams } from "react-router-dom"
import { MessagesList } from "./components/MessagesList"

const MessageSection = ({
  value,
  setValue,
}: {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [params] = useSearchParams()

  if (!params.get("chatId")) {
    return <NoChatSelected />
  }

  return (
    <section
      className={cn(
        "h-[100dvh] w-full hidden flex-col bg-background pt-[env(safe-area-inset-top)]",
        value && "flex",
        "sm:flex"
      )}
    >
      <MessageNavBar setValue={setValue} />
      <MessagesList />
      <MessageInput />
    </section>
  )
}

export default MessageSection
