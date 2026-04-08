import { Chrome } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { handleGoogleSignIn } from "../services/authService"

const errorMessages: Record<string, string> = {
  invalid_state: "Authentication failed. Please try again.",
  google_token_failed: "Failed to connect with Google. Please try again.",
  no_token: "No response from Google. Please try again.",
  server_error: "Something went wrong. Please try again.",
}

export const ContinueWithGoogle = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")

    if (error) {
      toast.error(errorMessages[error] ?? "Google sign-in failed.")
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  return (
    <Button
      type="button"
      onClick={handleGoogleSignIn}
      className="w-full h-11 font-medium group relative overflow-hidden shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
    >
      <Chrome className="w-5 h-5 group-hover:scale-110 transition-transform" />
      Continue with Google
    </Button>
  )
}
