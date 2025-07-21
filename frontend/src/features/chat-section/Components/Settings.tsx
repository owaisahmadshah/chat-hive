import { HelpCircle, LogOut, Trash } from "lucide-react"
import { useSelector } from "react-redux"

import { ScrollArea } from "@/components/ui/scroll-area"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useUserDelete from "@/hooks/useUserDelete"
import { RootState } from "@/store/store"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useUser } from "../hooks/useUser"

const Settings = () => {
  const user = useSelector((state: RootState) => state.user)

  const { updateUserField } = useUser()

  const listItemClasses =
    "flex items-center gap-2 justify-baseline w-[90%] cursor-pointer"

  const { deleteUser } = useUserDelete()

  const handleDelete = async () => {
    await deleteUser()
  }

  return (
    <main className="border-r h-full">
      <h1 className="text-2xl m-5">
        <strong>Settings</strong>
      </h1>
      <ScrollArea className="h-[88vh]">
        {" "}
        {/**Setting it 88 b/c of the above h1 tag */}
        <ul className="w-full flex flex-col items-center gap-4 relative">
          <li className={cn(listItemClasses, "sticky top-0 bg-background")}>
            <Input placeholder="Search settings" disabled />
          </li>
          <li className={listItemClasses}>
            <p className="w-[50%]">About</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{user.showAbout}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showAbout",
                        fieldValue: "private",
                      })
                    }
                  >
                    Private
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showAbout",
                        fieldValue: "public",
                      })
                    }
                  >
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showAbout",
                        fieldValue: "contacts",
                      })
                    }
                  >
                    Contacts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <Separator />
          <li className={listItemClasses}>
            <p className="w-[50%]">Last Seen</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{user.showLastSeen}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showLastSeen",
                        fieldValue: "private",
                      })
                    }
                  >
                    Private
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showLastSeen",
                        fieldValue: "public",
                      })
                    }
                  >
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showLastSeen",
                        fieldValue: "contacts",
                      })
                    }
                  >
                    Contacts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <Separator />
          <li className={listItemClasses}>
            <p className="w-[50%]">Profile Picture</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">{user.showProfileImage}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showProfileImage",
                        fieldValue: "private",
                      })
                    }
                  >
                    Private
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showProfileImage",
                        fieldValue: "public",
                      })
                    }
                  >
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "showProfileImage",
                        fieldValue: "contacts",
                      })
                    }
                  >
                    Contacts
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <Separator />
          <li className={listItemClasses}>
            <p className="w-[50%]">Read Receipts</p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {user.isReadReceipts ? "on" : "off"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() =>
                      updateUserField({
                        field: "isReadReceipts",
                        fieldValue: !user.isReadReceipts,
                      })
                    }
                  >
                    {user.isReadReceipts ? "off" : "on"}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <Separator />
          <li className={listItemClasses}>
            <p className="w-[50%]">ChangeTheme</p>
            <ModeToggle />
            {/**ModeToggle is already inside a button */}
          </li>
          <Separator />
          <li className={listItemClasses}>
            <p className="w-[50%]">Help</p>
            <Button variant={"ghost"}>
              <HelpCircle />
            </Button>
          </li>
          <Separator />
          <li className={cn(listItemClasses, "text-red-400")}>
            <Trash />
            <button onClick={handleDelete}>Delete Account</button>
          </li>
          <Separator />
          <li className={cn(listItemClasses, "text-red-400")}>
            <LogOut />
            <p>Sign Out</p>
          </li>
        </ul>
      </ScrollArea>
    </main>
  )
}

export default Settings
