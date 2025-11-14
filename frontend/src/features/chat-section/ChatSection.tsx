import React, { useState } from "react"

import ChatNavbar from "@/features/chat-section/Components/ChatNavBar"
import ChatList from "@/features/chat-section/Components/ChatList"
import ChatSectionSidebar from "@/features/chat-section/Components/ChatSectionSidebar"
import Profile from "@/features/chat-section/Components/Profile"
import { selectedComponentType } from "shared"
import Friends from "@/features/chat-section/Components/Friends"
import { cn } from "@/lib/utils"

const ChatSection = ({
  value,
  setValue,
}: {
  value: boolean
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [selectedComponent, setSelectedComponent] =
    useState<selectedComponentType>("chats")

  return (
    <section
      className={cn(
        "flex bg-background md:min-w-[420px] w-[420px] border-r border-border/40",
        "max-sm:w-full",
        value && "max-sm:hidden",
        "transition-all duration-300"
      )}
    >
      <ChatSectionSidebar
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
      <main className="flex flex-col w-full overflow-hidden">
        {selectedComponent === "chats" ? (
          <>
            <ChatNavbar />
            <ChatList setValue={setValue} />
          </>
        ) : selectedComponent === "friends" ? (
          <Friends />
        ) : (
          <Profile />
        )}
      </main>
    </section>
  )
}

export default ChatSection
