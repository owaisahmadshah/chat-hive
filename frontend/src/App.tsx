import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import ChatSection from "@/features/chat-section/ChatSection"
import useGetUserId from "@/hooks/useGetUserId"
import MessageSection from "@/features/message-section/MessageSection"
import { useSocketService } from "./hooks/useSocketService"
import usePresenceStatus from "./hooks/usePresenceStatus"
import { useSelector } from "react-redux"
import { RootState } from "./store/store"
import Loader from "./components/Loader"
import useGetUserChatsAndMessages from "./features/chat-section/hooks/useGetUserChatsAndMessages"

/**
 * Main application component that serves as the root of the application.
 * Handles authentication state and renders appropriate components based on user's authentication status.
 * 
 * @component
 * @returns {JSX.Element} The main application layout with authentication-aware rendering
 */
function App() {
  // Initialize essential hooks for application functionality
  useGetUserId() //* This will get the user data and userId which is crucial for making api requests
  useSocketService() //* Initializes socket.io connection for real-time communication
  usePresenceStatus() //* This will update user online/offline status using socket.io
  useGetUserChatsAndMessages() //* Fetches user's chats and messages on application load

  const { isLoading } = useSelector((state: RootState) => state.chats)

  return (<>
    <SignedOut>
      <ContinueWithGoogle />
    </SignedOut>
    <SignedIn>
      {
        isLoading ? <Loader />
          : <main className="flex">
            <ChatSection />
            <MessageSection />
          </main>
      }
    </SignedIn>
  </>)
}

export default App
