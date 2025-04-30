import { useState } from "react"

import ChatNavbar from "@/features/chat-section/Components/ChatNavBar"
import ChatList from "@/features/chat-section/Components/ChatList"
import ChatSectionSidebar from "@/features/chat-section/Components/ChatSectionSidebar"
import Settings from "@/features/chat-section/Components/Settings"
import Profile from "@/features/chat-section/Components/Profile"
import { selectedComponentType } from "shared"
import Friends from "@/features/chat-section/Components/Friends"

const ChatSection = () => {
  const [selectedComponent, setSelectedComponent] = useState<selectedComponentType>("chats")

  return (
    <section className="flex bg-background box-border max-h-[100vh] min-h-[100vh] min-w-[400px] max-w-[400px]">
      <ChatSectionSidebar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
      <main className="flex flex-col w-full">
        {
          selectedComponent === "chats" ?
            <><ChatNavbar />
              <ChatList /></>
            : selectedComponent === "settings" ? <Settings />
              : selectedComponent === "friends" ? <Friends />
                : <Profile />
        }
      </main>
    </section>
  )
}


export default ChatSection
