import React, { useState } from "react"

import ChatNavbar from "@/features/chat-section/Components/ChatNavBar"
import ChatList from "@/features/chat-section/Components/ChatList"
import ChatSectionSidebar from "@/features/chat-section/Components/ChatSectionSidebar"
import Settings from "@/features/chat-section/Components/Settings"
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
        "flex bg-background min-w-0 w-[500px]",
        "max-sm:w-full",
        value && "max-sm:hidden"
      )}
    >
      <ChatSectionSidebar
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
      />
      <main className="flex flex-col w-full">
        {selectedComponent === "chats" ? (
          <>
            <ChatNavbar />
            <ChatList setValue={setValue} />
          </>
        ) : selectedComponent === "settings" ? (
          <Settings />
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
