import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import ChatSection from "@/features/chat-section/ChatSection"
import useGetUserId from "@/hooks/useGetUserId"
import MessageSection from "@/features/message-section/MessageSection"
import { useSocketService } from "./hooks/useSocketService"
import usePresenceStatus from "./hooks/usePresenceStatus"

function App() {

  //* This will get the user data and userId which is crucial for making api requests
  useGetUserId()
  useSocketService()
  usePresenceStatus() //* This will update user online/offline status using socket.io

  return (<>
    <SignedOut>
      <ContinueWithGoogle />
    </SignedOut>
    <SignedIn>
      <main className="flex">
        <ChatSection />
        <MessageSection />
      </main>
    </SignedIn>
  </>)
}

export default App
