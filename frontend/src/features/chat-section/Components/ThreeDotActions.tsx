import { MoreVertical } from "lucide-react"
import { SignOutButton } from "@clerk/clerk-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const ThreeDotsMenu = () => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="p-2 rounded-full cursor-pointer">
            <MoreVertical className="h-5 w-5 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            My Account
          </DropdownMenuLabel>
          <DropdownMenuItem className="cursor-pointer" onSelect={(e) => e.preventDefault()}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500 cursor-pointer" onSelect={(e) => e.preventDefault()}>
            <SignOutButton />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ThreeDotsMenu