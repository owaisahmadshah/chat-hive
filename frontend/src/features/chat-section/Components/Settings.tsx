import { ScrollArea } from "@/components/ui/scroll-area"
import { SignOutButton } from "@clerk/clerk-react"
import { HelpCircle, LockIcon, LogOut, Trash } from "lucide-react"

import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useUserDelete from "@/hooks/useUserDelete"

const Settings = () => {
  const listItemClasses = "flex items-center gap-2 justify-baseline w-[90%] cursor-pointer"

  const { deleteUser } = useUserDelete()

  const handleDelete = async () => {
    await deleteUser()
  }

  return (<main className="border-r h-full">
    <h1 className="text-2xl m-5"><strong>Settings</strong></h1>
    <ScrollArea className="h-[88vh]"> {/**Setting it 88 b/c of the above h1 tag */}
      <ul className="w-full flex flex-col items-center gap-4 relative">
        <li className={cn(listItemClasses, "sticky top-0 bg-background")}><Input placeholder="Search settings" disabled /></li>
        <li className={listItemClasses}><Button variant={"ghost"}><LockIcon /></Button><p>Privacy</p></li>
        <Separator />
        <li className={listItemClasses}><ModeToggle />{/**ModeToggle is already inside a button */} <p>ChangeTheme</p></li>
        <Separator />
        <li className={listItemClasses}><Button variant={"ghost"}><HelpCircle /></Button><p>Help</p></li>
        <Separator />
        <li className={cn(listItemClasses, "text-red-400")}>
          <Trash />
          <button onClick={handleDelete}>Delete Account</button>
        </li>
        <Separator />
        <li className={cn(listItemClasses, "text-red-400")}><LogOut /><SignOutButton /></li>
      </ul>
    </ScrollArea>
  </main>
  )
}

export default Settings
