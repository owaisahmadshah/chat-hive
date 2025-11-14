import { useSelector } from "react-redux"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { RootState } from "@/store/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash, MessageCircle, Sparkles } from "lucide-react"
import { useChat } from "../hooks/useChat"
import useFriend from "../hooks/useFriend"
import { friendInterface } from "@/types/friend-interface"

export default function Friends() {
  const { isLoaded, friends } = useSelector((state: RootState) => state.friend)
  const uid = useSelector((state: RootState) => state.user.userId)
  const chats = useSelector((state: RootState) => state.chats.chats)

  const { createNewChat } = useChat()
  const { deleteUser } = useFriend()

  const isChatExistsCheck = (userId: string) => {
    if (userId === uid) return chats.some((chat) => chat.users.length === 1)
    return chats.some((chat) => chat.users.some((u) => u._id === userId))
  }

  const handleDeleteFriend = async (friend: friendInterface) => {
    await deleteUser(friend._id)
  }

  const handleOpenChat = (user: friendInterface) => {
    console.info("Handle open chat with", user)
  }

  const handleCreateChat = async (user: friendInterface) => {
    await createNewChat(user.friend)
  }

  return (
    <main className="border-r flex flex-col items-center gap-4 py-6 bg-background/60 backdrop-blur-xl">
      <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" /> Friends
      </h1>

      <Input
        type="text"
        placeholder="Search friends..."
        className="w-[80%] mx-auto rounded-xl shadow-sm"
        disabled
      />

      <ScrollArea className="w-full px-4">
        <ul className="h-[80vh] flex flex-col items-center w-full">
          {!isLoaded && <p>Loading...</p>}
          {isLoaded && friends.length === 0 && (
            <p className="text-sm text-muted-foreground mt-4">
              You do not have any friends
            </p>
          )}

          {isLoaded &&
            friends.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-secondary/70 transition-all mb-1 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <Avatar className="cursor-pointer border shadow">
                    <AvatarImage src={user.friend.imageUrl} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>

                  <p className="text-sm font-medium break-words whitespace-normal w-[120px]">
                    {`${user.friend.username}$
                      {user.friend._id === uid ? " (You)" : ""}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => handleDeleteFriend(user)}
                    variant="ghost"
                    className="text-red-500 hover:text-red-700 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>

                  {isChatExistsCheck(user.friend._id) ? (
                    <Button
                      variant="secondary"
                      className="text-sm rounded-xl shadow"
                      onClick={() => handleOpenChat(user)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" /> Open Chat
                    </Button>
                  ) : (
                    <Button
                      className="text-sm rounded-xl shadow"
                      onClick={() => handleCreateChat(user)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" /> Start Chat
                    </Button>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </ScrollArea>
    </main>
  )
}
