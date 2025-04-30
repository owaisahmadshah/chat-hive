import { useSelector } from "react-redux"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { RootState } from "@/store/store"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { useChat } from "../hooks/useChat"
import useFriend from "../hooks/useFriend"
import { friendInterface } from "@/types/friend-interface"

const Friends = () => {
  const { isLoaded, friends } = useSelector((state: RootState) => state.friend)
  const uid = useSelector((state: RootState) => state.user.userId)
  const chats = useSelector((state: RootState) => state.chats.chats)

  const { createNewChat } = useChat()
  const { deleteUser } = useFriend()

  const isChatExistsCheck = (userId: string) => {
    // If userId is same as signed user and number of users in chat is equal to one that means signed in user already has chat of him
    if (userId === uid) {
      return chats.some(chat => chat.users.length === 1)
    }
    const isChatExist = chats.some(chat => chat.users.some(u => u._id === userId))
    if (isChatExist) {
      // TODO check why this re-renders infinite times
      // setExistedChat(chats.find(chat => chat.users.some(u => u._id === user._id)) || null)
    }
    return isChatExist
  }

  const handleDeleteFriend = async (friend: friendInterface) => {
    // TODO hand
    await deleteUser(friend._id)
  }

  const handleOpenChat = (user: friendInterface) => {
    // TODO
    console.info("Handle open chat with", user)
  }

  const handleCreateChat = async (user: friendInterface) => {
    await createNewChat(user.friend)
  }

  return (
    <main className="border-r flex flex-col items-center gap-4">
      <h1 className="block text-2xl font-bold mt-4">Friends</h1>
      <Input
        type="text"
        placeholder="Search..."
        className="w-[80%] mx-auto"
        disabled
      />
      <ScrollArea className="mx-auto">
        <ul className="h-[80vh] flex flex-col items-center">
          {!isLoaded && <p>Loading</p>}
          {isLoaded && friends.length === 0 && <p className="text-sm text-muted-foreground">You do not have any friends</p>}
          {isLoaded && friends.map((user) =>
            <li className="flex gap-2 items-center justify-around p-2 hover:bg-secondary" key={user._id}>
              <div className="flex justify-center items-center gap-5">
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.friend.imageUrl} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-sm break-words whitespace-normal w-[100px]">
                  {`${user.friend.username}${user.friend._id === uid ? " (You)" : ""}`}
                </p>
              </div>
              <Button
                onClick={() => handleDeleteFriend(user)}
                className="cursor-pointer hover:bg-background"
                variant={"ghost"}
              >
                <Trash />
              </Button>
              {
                isChatExistsCheck(user.friend._id) ?
                  <Button
                    variant={"destructive"}
                    className="text-sm cursor-pointer"
                    onClick={() => handleOpenChat(user)}
                  >
                    Open chat
                  </Button>
                  :
                  <Button
                    className="text-sm cursor-pointer"
                    onClick={() => handleCreateChat(user)}
                  >
                    Start Chat
                  </Button>
              }
            </li>
          )
          }
        </ul>
      </ScrollArea>
    </main>
  )
}

export default Friends
