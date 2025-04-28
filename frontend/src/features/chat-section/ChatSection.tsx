import { useState } from "react"

import ChatNavbar from "@/features/chat-section/Components/ChatNavBar"
import ChatList from "./Components/ChatList"
import ChatSectionSidebar from "./Components/ChatSectionSidebar"
import Settings from "./Components/Settings"
import Profile from "./Components/Profile"

type selectedComponentType = "chats" | "user_profile" | "settings"

const ChatSection = () => {
  const [selectedComponent, setSelectedComponent] = useState<selectedComponentType>("chats")

  return (
    <section className="flex bg-background box-border max-h-[100vh] min-h-[100vh] min-w-[400px] max-w-[400px]">
      <ChatSectionSidebar selectedComponent={selectedComponent} setSelectedComponent={setSelectedComponent} />
      <main className="flex flex-col w-full">
        {
          selectedComponent === "chats" ?
            <>
              <ChatNavbar />
              <ChatList />
            </>
            : selectedComponent === "settings" ? <Settings />
              : <Profile />
        }
      </main>
    </section>
  )
}


export default ChatSection
