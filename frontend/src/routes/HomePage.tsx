import { useSelector } from "react-redux"

import useGetUserId from "@/hooks/useGetUserId"
import ChatSection from "@/features/chat-section/ChatSection"
import MessageSection from "@/features/message-section/MessageSection"
import Loader from "@/components/Loader"
import { useSocketService } from "@/hooks/useSocketService"
import usePresenceStatus from "@/hooks/usePresenceStatus"
import { RootState } from "@/store/store"
import useGetUserChatsAndMessages from "@/features/chat-section/hooks/useGetUserChatsAndMessages"
import useGetFriends from "@/hooks/useGetFriends"


const HomePage = () => {
  // Initialize essential hooks for application functionality
  // All these methods will be initialzied if and only if user is authenticated
  useGetUserId() //* This will get the user data and userId which is crucial for making api requests
  useSocketService() //* Initializes socket.io connection for real-time communication
  usePresenceStatus() //* This will update user online/offline status using socket.io
  useGetUserChatsAndMessages() //* Fetches user's chats and messages on application load
  useGetFriends() //* Fetches friends

  const { isLoading } = useSelector((state: RootState) => state.chats)

  return (
    <>{
      isLoading ? <Loader />
        : <main className="flex">
          <ChatSection />
          <MessageSection />
        </main>
    }
    </>
  )
}

export default HomePage
