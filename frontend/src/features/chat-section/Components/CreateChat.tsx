import { ChangeEvent, useCallback, useState } from "react"
import {
  Plus,
  Search,
  UserPlus,
  Loader2,
  MessageCircleMore,
} from "lucide-react"
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
import { ChatUser } from "shared"
import CreateChatUserItem from "./CreateChatUserItem"
import { fetchUserByUsername } from "../hooks/useFetchUserByUsername"

const CreateChat = () => {
  const [users, setUsers] = useState<ChatUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUsername, setIsUsername] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const debouncedSearch = useCallback(
    debounce(async (email: string) => {
      if (email.trim() === "") return

      setIsLoading(true)
      const result = await fetchUserByUsername(email)
      if (result.user) {
        setUsers(result.user)
      }
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="flex items-center gap-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all group">
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          <span>New Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-full sm:max-w-[420px] p-0 flex flex-col gap-0 overflow-hidden"
      >
        <SheetHeader className="p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-xl">New Conversation</SheetTitle>
              <SheetDescription className="text-xs">
                Find someone to start a new chat with
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by username..."
              className="pl-10 h-12 bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-2xl transition-all"
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-1 pb-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="w-10 h-10 text-primary/40 animate-spin mb-4" />
                <p className="text-sm text-muted-foreground">
                  Searching users...
                </p>
              </div>
            ) : users.length > 0 ? (
              users.map((user: ChatUser) => (
                <CreateChatUserItem
                  key={user._id}
                  user={user}
                  onClose={() => setOpen(false)}
                />
              ))
            ) : isUsername ? (
              // ... Empty state stays similar but maybe use a softer background
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-muted-foreground/50" />
                </div>
                <h3 className="font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground">
                  Try a different username
                </p>
              </div>
            ) : (
              // ... Initial state
              <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                  <MessageCircleMore className="w-8 h-8 text-primary/40" />
                </div>
                <h3 className="font-semibold text-foreground/80">
                  Search users
                </h3>
                <p className="text-sm text-muted-foreground">
                  Type a name to see available users.
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
