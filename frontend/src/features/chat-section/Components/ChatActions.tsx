import { Trash2, MoreVertical } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface IChatActionsProps {
  deleteAction: () => Promise<unknown>
}

export default function ChatActions({ deleteAction }: IChatActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          onClick={(e) => e.stopPropagation()}
          className="p-2 rounded-xl hover:bg-accent transition-all duration-200 group cursor-pointer"
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="w-48 rounded-2xl shadow-xl border bg-popover/95 backdrop-blur-md"
      >
        <DropdownMenuItem
          onClick={deleteAction}
          className="flex items-center gap-3 py-2.5 cursor-pointer text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
