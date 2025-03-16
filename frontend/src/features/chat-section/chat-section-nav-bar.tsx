import { UserButton } from "@clerk/clerk-react"

import ChatHiveLogo from "@/components/chat-hive-logo"

const ChatNavbar = () => {
  return (
    <ul className="w-[100%] h-[15vh] flex justify-between items-center p-5 bg-background border-b">
      <li className="cursor-pointer"><ChatHiveLogo /></li>
      <li><UserButton /></li>
    </ul>
  )
}

export default ChatNavbar
