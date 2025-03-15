import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/ContinueWithGoogle"
import ChatSection from "@/features/chat-section/ChatSection"

function App() {
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
