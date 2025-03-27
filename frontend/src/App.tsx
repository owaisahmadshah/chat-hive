import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import ChatSection from "@/features/chat-section/ChatSection"
import useGetUserId from "@/hooks/useGetUserId"
import MessageSection from "@/features/message-section/MessageSection"
import { ModeToggle } from "./components/mode-toggle"
import { useSocketService } from "./hooks/useSocketService"

function App() {

  //* This will get the user data and userId which is crucial for making api requests
  useGetUserId()
  useSocketService()

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
    <span className="sticky bottom-0">
        <ModeToggle />
      </span>
  </>)
}

export default App
