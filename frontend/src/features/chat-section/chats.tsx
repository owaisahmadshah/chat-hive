import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store/store'
import { Chat, ChatUser } from '@/types/chat-interface'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { setSelectedChat } from '@/store/slices/chats'

const Chats = () => {

  const dispatch = useDispatch()
  const chats = useSelector((state: RootState) => state.chats)
  const userId = useSelector((state: RootState) => state.user.userId)


  const handleClickedChat = (selectedChat: Chat) => {
    dispatch(setSelectedChat(selectedChat))
  }

  function chatName(chatUsersList: ChatUser[]) {
    let nameOrEmail = ""
    for (let i = 0; i < chatUsersList.length; i++) {
      if (chatUsersList[i]._id !== userId) {
        nameOrEmail = chatUsersList[i].email
        break
      }
    }
    // TODO Check if the user is saved in our contacts then return contactName if not return email
    return nameOrEmail
  }

  const correctDate = (updatedAt: string | Date) => {
    const date = new Date(updatedAt)
    const now = new Date()

    const isToday = date.toDateString() === now.toDateString()

    if (isToday) {
      // Display time if it's today
      return date.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
    }

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(now.getDate() - 7)

    if (date > oneWeekAgo) {
      // Display weekday name if it's within a week
      return date.toLocaleDateString('en-PK', { weekday: 'long' })
    }

    // Display date in DD/MM/YYYY format if itF's older than a week
    return date.toLocaleDateString('en-PK')
  }

  return (
    <ScrollArea className="box-border border-r border-l h-[84vh]">
      <ul className="flex flex-col max-h-[84vh]">
        {
          !chats.isLoading &&
          chats.chats
            .map((chat: Chat, index) => (
              <li
                key={index}
                onClick={() => handleClickedChat(chat)}
                className='cursor-pointer p-5 bg-red flex flex-col justify-center'
              >
                <div className="flex items-center gap-5">
                  <Avatar>
                    <AvatarImage src={chat.users[0].imageUrl} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-l overflow-x-hidden max-w-[160px]">
                      {chatName(chat.users)}
                    </p>
                    <div className='flex justify-between'>
                      <p className="text-sm overflow-x-hidden text-muted-foreground max-w-[160px] text-ellipsis whitespace-nowrap">{"..."}</p>
                      <p className='text-sm text-muted-foreground'>{correctDate(chat.updatedAt)}</p>
                    </div>
                  </div>
                </div>
                <Separator className="mt-3" />
              </li>
            ))
        }
      </ul>
    </ScrollArea>
  )
}

export default Chats
