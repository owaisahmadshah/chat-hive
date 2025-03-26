import { useEffect } from "react"
import { useSocketService } from "@/hooks/useSocketService"
import { RootState } from "@/store/store"
import { useSelector } from "react-redux"
import { useUser } from "@clerk/clerk-react"

const useSocket = () => {
  const user = useSelector((state: RootState) => state.user)
  const { isSignedIn } = useUser()
  const { connectSocket, disconnectSocket } = useSocketService()

  useEffect(() => {
    if (user.userId && isSignedIn) {
      connectSocket(user.userId)
    }
    return () => {
      disconnectSocket()
    }
  }, [user, isSignedIn])
}

export { useSocket }
