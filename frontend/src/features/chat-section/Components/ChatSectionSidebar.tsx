import { cn } from "@/lib/utils"
import { RootState } from "@/store/store"
import { Contact2, MessageSquare } from "lucide-react"
import { useSelector } from "react-redux"
import { selectedComponentType } from "shared"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type ChatSectionSidebarProps = {
  selectedComponent: selectedComponentType
  setSelectedComponent: React.Dispatch<
    React.SetStateAction<selectedComponentType>
  >
}

const ChatSectionSidebar = ({
  selectedComponent,
  setSelectedComponent,
}: ChatSectionSidebarProps) => {
  const { imageUrl } = useSelector((state: RootState) => state.user)

  const SidebarButton = ({
    name,
    icon,
    label,
  }: {
    name: selectedComponentType
    icon: React.ReactNode
    label: string
  }) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <li
            className={cn(
              "cursor-pointer transition-all duration-200 p-3 rounded-xl",
              "hover:bg-primary/10",
              selectedComponent === name
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setSelectedComponent(name)}
          >
            {icon}
          </li>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <div className="h-screen w-20 border-r border-border/40 flex flex-col justify-between items-center py-6 bg-background/50 backdrop-blur-sm">
      <ul className="flex flex-col gap-2">
        <SidebarButton
          name="chats"
          icon={<MessageSquare className="w-6 h-6" />}
          label="Chats"
        />
        <SidebarButton
          name="friends"
          icon={<Contact2 className="w-6 h-6" />}
          label="Friends"
        />
      </ul>

      <ul className="flex flex-col gap-2 items-center">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <li
                className={cn(
                  "cursor-pointer transition-all duration-200 rounded-xl overflow-hidden",
                  "hover:ring-2 hover:ring-primary/50",
                  selectedComponent === "user_profile" && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedComponent("user_profile")}
              >
                <img
                  src={imageUrl}
                  alt="Profile"
                  className="w-11 h-11 rounded-xl object-cover"
                />
              </li>
            </TooltipTrigger>
            <TooltipContent side="right" className="text-xs">
              Profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ul>
    </div>
  )
}

export default ChatSectionSidebar
