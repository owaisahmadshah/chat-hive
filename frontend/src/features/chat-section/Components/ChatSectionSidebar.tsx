import { cn } from "@/lib/utils"
import { RootState } from "@/store/store";
import { MessageSquareIcon, Settings } from "lucide-react";
import { useSelector } from "react-redux";

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
      "cursor-pointer text-muted-foreground",
      selectedComponent === name && "text-foreground"
    )

  const { imageUrl } = useSelector((state: RootState) => state.user)

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

      <ul className="flex flex-col gap-4 items-center">
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
          <img
            src={imageUrl}
            alt={""}
            className="max-w-[40px] max-h-[40px] rounded-full"
          />
        </li>
      </ul>
    </div>
  )
}

export default ChatSectionSidebar
