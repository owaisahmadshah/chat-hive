import { ChangeEvent, useCallback, useState } from "react"
import { Plus, Search, UserPlus, Loader2 } from "lucide-react"
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
  const [isUsername, setIsUsername] = useState<boolean>(false)

  const { fetchUsers } = useChat()

  const debouncedSearch = useCallback(
    debounce(async (email: string) => {
      if (email.trim() === "") return

      setIsLoading(true)
      const result = await fetchUsers(email)
      setUsers(result)
      setIsLoading(false)
    }, 500),
    []
  )

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const searchUsername = e.target.value.trim()
    setIsUsername(searchUsername !== "")
    if (searchUsername === "") {
      setUsers([])
      return
    }
    await debouncedSearch(searchUsername)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[400px] sm:w-[500px]">
        <SheetHeader className="space-y-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" />
            Start New Chat
          </SheetTitle>
          <SheetDescription>
            Search for a user by username to start chatting
          </SheetDescription>
        </SheetHeader>

        {/* Search Input */}
        <div className="mt-6 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by username..."
              className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20"
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <ScrollArea className="h-[calc(100vh-250px)] mt-6">
          <div className="space-y-2">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">
                  Searching for users...
                </p>
              </div>
            ) : users.length > 0 ? (
              users.map((user: ChatUser) => (
                <div
                  key={user._id}
                  className="p-3 rounded-lg hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <CreateChatUserItem user={user} />
                </div>
              ))
            ) : isUsername ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  No users found
                </p>
                <p className="text-xs text-muted-foreground">
                  Try searching with a different username
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm font-medium">Start searching</p>
                <p className="text-xs text-muted-foreground text-center max-w-[250px]">
                  Enter a username to find people and start chatting
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

export default CreateChat
