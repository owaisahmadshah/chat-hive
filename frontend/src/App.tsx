import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/continue-with-google-landing-page"
import ChatSection from "@/features/chat-section/chat-section"
import useGetUserId from "./hooks/useGetUserId"

function App() {

  //* This will get the user data and userId which is crucial for making api requests
  useGetUserId()

  return (<>
    <SignedOut>
      <ContinueWithGoogle />
    </SignedOut>
    <SignedIn>
      <ChatSection />
    </SignedIn>
  </>)
}

export default App
