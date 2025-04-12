import { cn } from "@/lib/utils"
import { UserButton } from "@clerk/clerk-react"
import { MessageSquareIcon, Settings } from "lucide-react";

type SelectedComponentType = "chats" | "user_profile" | "settings"

type ChatSectionSidebarProps = {
  selectedComponent: SelectedComponentType
  setSelectedComponent: React.Dispatch<React.SetStateAction<SelectedComponentType>>
}

const ChatSectionSidebar = ({
  selectedComponent,
  setSelectedComponent,
}: ChatSectionSidebarProps) => {
  // Returns the class names for a sidebar item based on whether it's selected
  const getItemClass = (name: SelectedComponentType) =>
    cn(
      "cursor-pointer text-foreground",
      selectedComponent === name && "text-muted-foreground"
    )

  return (
    <div className="h-[100vh] w-[70px] border-r flex flex-col justify-between items-center py-10">
      <ul>
        <li
          className={getItemClass("chats")}
          onClick={() => setSelectedComponent("chats")}
        >
          <MessageSquareIcon />
        </li>
      </ul>

      <ul className="flex flex-col gap-4">
        <li
          className={getItemClass("settings")}
          onClick={() => setSelectedComponent("settings")}
        >
          <Settings />
        </li>
        <li
          className={getItemClass("user_profile")}
          onClick={() => setSelectedComponent("user_profile")}
        >
          <UserButton />
        </li>
      </ul>
    </div>
  )
}

export default ChatSectionSidebar
