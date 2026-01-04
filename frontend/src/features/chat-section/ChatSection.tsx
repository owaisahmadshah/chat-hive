import ChatNavbar from "@/features/chat-section/Components/ChatNavBar"
import ChatList from "@/features/chat-section/Components/ChatList"
import { cn } from "@/lib/utils"

const ChatSection = ({
  value,
  setValue,
}: {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <section
      className={cn(
        "flex flex-col overflow-hidden bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        value && "max-sm:hidden",
        "transition-all duration-300"
      )}
    >
      <ChatNavbar />
      <ChatList setValue={setValue} />
    </section>
  )
}

export default ChatSection
