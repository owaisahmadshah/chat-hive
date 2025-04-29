import { ChangeEvent, useCallback, useState } from "react"
import { Plus } from "lucide-react"
import debounce from "lodash.debounce"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { useChat } from "../hooks/useChat"
import { ChatUser } from "shared"
import CreateChatUserItem from "./CreateChatUserItem"

const CreateChat = () => {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { fetchUsers } = useChat()

  const debouncedSearch = useCallback(debounce(async (email: string) => {
    if (email.trim() == "") {
      return
    }
    setIsLoading(true)
    const result = await fetchUsers(email)
    setUsers(result)
    setIsLoading(false)
  }, 500), [])

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      return
    }
    await debouncedSearch(e.target.value.trim())
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <span>
          <Button variant="outline" className="flex items-center gap-2 p-2 cursor-pointer">
            <Plus className="w-6 h-6" />
            <span>New Chat</span>
          </Button>
        </span>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <SheetHeader>
          <SheetTitle>Create a new chat</SheetTitle>
          <SheetDescription>
            Search by email and create your chat if user exists.
          </SheetDescription>
        </SheetHeader>
        <Input
          type="email"
          placeholder="Enter email..."
          className="w-[80%] mx-auto"
          onChange={handleInputChange}
        />
        <ScrollArea>
          <ul className="h-[70vh]">
            {isLoading && <li className="ml-[15%] text-muted-foreground text-sm">Searching...</li>}
            {
              users.length ? users.map((user: ChatUser) => (
                <li className="flex gap-2 items-center justify-around p-2 hover:bg-secondary" key={user._id}>
                  <CreateChatUserItem user={user} />
                </li>
                // TODO suggest user to invite this user if this user doesn't exists
              )) : ""
            }
          </ul>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CreateChat
