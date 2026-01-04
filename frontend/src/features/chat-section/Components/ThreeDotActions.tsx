import { MoreVertical, UserRound } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "react-router-dom"

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
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Link to={"/users"} className="flex gap-3 w-full">
              <UserRound className="w-6 h-6" /> <span>Users</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <Link to={"/connections"} className="flex gap-3 w-full">
              <UserRound className="w-6 h-6" /> <span>Connections</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onSelect={(e) => e.preventDefault()}
          >
            <p>Sign Out</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ThreeDotsMenu
