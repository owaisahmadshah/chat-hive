import { UserButton } from "@clerk/clerk-react"

import ChatHiveLogo from "@/components/chat-hive-logo"
import CreateChat from "./CreateChat"

const ChatNavbar = () => {
  return (
    <ul className="w-[100%] h-[15vh] flex justify-between items-center p-5 bg-background border-b border-r">
      <li className="cursor-pointer"><ChatHiveLogo /></li>
      <li>
        <span className="flex gap-2">
          <CreateChat />
          <UserButton />
        </span>
      </li>
    </ul>
  )
}

export default ChatNavbar
