import { SignedIn, SignedOut } from "@clerk/clerk-react"

import ContinueWithGoogle from "@/features/auth/ContinueWithGoogle"

function App() {
  return (<>
    <SignedOut>
      <ContinueWithGoogle />
    </SignedOut>
    <SignedIn>
    </SignedIn>
  </>)
}

export default App
