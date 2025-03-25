import { useEffect } from "react"
import { socketService } from "@/lib/socketService"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useUser } from "@clerk/clerk-react"

const useSocket = () => {
  const user = useSelector((state: RootState) => state.user)
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (user.userId && isSignedIn) {
      socketService.connect(user.userId)
    } else {
      console.info("User not signed in, not connecting to socket")
    }
    return () => {
      socketService.disconnect()
    }
  }, [user, isSignedIn])
}

export { useSocket }
