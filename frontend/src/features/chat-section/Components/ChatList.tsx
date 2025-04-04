import { useDispatch, useSelector } from 'react-redux'

import { RootState } from '@/store/store'
import { Chat, ChatUser } from '@/types/chat-interface'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { setSelectedChat, setSelectedChatUser, updateChatWithPersistentOrder, } from '@/store/slices/chats'
import correctDate from '@/lib/correct-date'
import ChatActions from './ChatActions'
import { ChatListSkeleton } from './ChatsListSkeleton'
import NoChats from './NoChats'
import { Image } from 'lucide-react'
import { useMessage } from '@/features/message-section/hooks/useMessage'

const Chats = () => {

  const dispatch = useDispatch()
  const chats = useSelector((state: RootState) => state.chats)
  const userId = useSelector((state: RootState) => state.user.userId)

  const { updateMessagesStatus } = useMessage()

  const handleClickedChat = async (selectedChat: Chat) => {
    // If currently clicked chat is not the same as the selected chat, then update the unread messages to 0
    if (selectedChat._id !== chats.selectedChat?._id) {
      dispatch(updateChatWithPersistentOrder({ chatId: selectedChat._id, updates: { unreadMessages: 0 } }))
    }

    // If currently clicked chat is not the same as the selected chat and the currently clicked chat(selectedChat) has unread messages, then update the unread message in database
    if (selectedChat._id !== chats.selectedChat?._id && selectedChat.unreadMessages > 0) {
      // Again check if the selected chat is not the same as the selected chat in redux store
      let hasUnreadMessages = false
      let unreadMessages = 0
      for (let i = 0; i < chats.chats.length; i++) {
        if (chats.chats[i]._id === selectedChat._id) {
          if (chats.chats[i].unreadMessages > 0) {
            hasUnreadMessages = true
            unreadMessages = chats.chats[i].unreadMessages
          }
          break
        }
      }

      if (hasUnreadMessages) {
        await updateMessagesStatus(selectedChat._id, unreadMessages, "seen")
      }
    }

    dispatch(setSelectedChat(selectedChat))

    if (selectedChat.users.length === 1) {
      dispatch(setSelectedChatUser(selectedChat.users[0]))
      return
    }

    for (let i = 0; i < selectedChat.users.length; i++) {
      if (selectedChat.users[i]._id !== userId) {
        dispatch(setSelectedChatUser(selectedChat.users[i]))
        break
      }
    }
  }

  function chatUserEmail(chatUsersList: ChatUser[]) {
    if (chatUsersList.length === 1) {
      return chatUsersList[0].email
    }
    let email = ""
    for (let i = 0; i < chatUsersList.length; i++) {
      if (chatUsersList[i]._id !== userId) {
        email = chatUsersList[i].email
        break
      }
    }
    return email
  }

  return (
    <ScrollArea className="box-border border-r border-l h-[84vh]">
      <ul className="flex flex-col max-h-[84vh]">
        {chats.isLoading && <ChatListSkeleton count={10} />}
        {chats.chats.length === 0 && <NoChats />}
        {
          !chats.isLoading && chats.chats.length > 0 &&
          chats.chats
            .map((chat: Chat, index) => (
              <li
                key={index}
                onClick={() => handleClickedChat(chat)}
                className='cursor-pointer px-5 pt-5 bg-red flex flex-col justify-center hover:bg-secondary'
              >
                <div className='flex justify-between'>

                  <div className="flex items-center gap-5">
                    <Avatar>
                      <AvatarImage src={
                        chat.users.length === 1 ? chat.users[0].imageUrl
                          : chat.users[0]._id === userId
                            ? chat.users[1].imageUrl
                            : chat.users[0].imageUrl
                      } />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-l overflow-x-hidden text-ellipsis whitespace-nowrap max-w-[160px]">
                        {chatUserEmail(chat.users)}
                      </p>
                      <div className='flex justify-between min-w-[15vw]'>
                        <div className="flex max-w-[140px] items-center gap-2"
                        >
                          {
                            chat?.typing && chat?.typing.isTyping
                              ? <p className='text-sm text-primary'>typing...</p>
                              : chat.unreadMessages > 0
                                ? <strong className='text-sm overflow-x-hidden text-primary text-ellipsis whitespace-nowrap'>{chat.unreadMessages} <span className='underline'>unread messages</span></strong>
                                : chat.lastMessage.isPhoto
                                  ? <Image height={15} width={15} />
                                  : <p className='text-sm overflow-x-hidden text-muted-foreground text-ellipsis whitespace-nowrap'>
                                    {chat.lastMessage.message}
                                  </p>
                          }
                        </div>
                        <p className='text-sm text-muted-foreground'>{correctDate(chat.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                  <ChatActions chat={chat} />
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
