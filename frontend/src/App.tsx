import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import ChatSection from "@/features/chat-section/ChatSection"
import useGetUserId from "@/hooks/useGetUserId"
import MessageSection from "@/features/message-section/MessageSection"
import { useSocket } from "@/hooks/useSocket"

function App() {

  //* This will get the user data and userId which is crucial for making api requests
  useGetUserId()
  useSocket()

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
