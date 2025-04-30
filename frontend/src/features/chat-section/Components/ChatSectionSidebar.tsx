import { cn } from "@/lib/utils"
import { RootState } from "@/store/store";
import { Contact2, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import ChatButtonLogo from "./ChatButtonLogo";
import { selectedComponentType } from "shared";

type ChatSectionSidebarProps = {
  selectedComponent: selectedComponentType
  setSelectedComponent: React.Dispatch<React.SetStateAction<selectedComponentType>>
}

const ChatSectionSidebar = ({
  selectedComponent,
  setSelectedComponent,
}: ChatSectionSidebarProps) => {
  // Returns the class names for a sidebar item based on whether it's selected
  const getItemClass = (name: selectedComponentType) =>
    cn(
      "cursor-pointer text-muted-foreground",
      selectedComponent === name && "text-foreground"
    )

  const { imageUrl } = useSelector((state: RootState) => state.user)

  return (
    <div className="h-[100vh] w-[70px] border-r flex flex-col justify-between items-center py-10">
      <ul className="grid gap-4">
        <li
          className={getItemClass("chats")}
          onClick={() => setSelectedComponent("chats")}
        >
          <ChatButtonLogo />
        </li>
        <li
          className={getItemClass("friends")}
          onClick={() => setSelectedComponent("friends")}
        >
          <strong><Contact2 /></strong>
        </li>
      </ul>

      <ul className="flex flex-col gap-4 items-center">
        <li
          className={getItemClass("settings")}
          onClick={() => setSelectedComponent("settings")}
        >
          <strong><Settings /></strong>
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
