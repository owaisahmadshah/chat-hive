import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"

import { clearUser, setUser } from "@/store/slices/user"
import { User } from "@/types/user-interface"
import { getUser } from "@/services/userService"

function useGetUser() {
  const dispatch = useDispatch()

  // When user opens website we will fetch his userId and details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUser()

        
        if (data.statusCode !== 200) {
          return
        }
        
        const payload: User = {
          email: data.data.email,
          username: data.data.username,
          userId: data.data._id,
          imageUrl: data.data.imageUrl,
          isLoading: false,
          about: data.data.about,
          showAbout: data.data.showAbout,
          showLastSeen: data.data.showLastSeen,
          isReadReceipts: data.data.isReadReceipts,
          showProfileImage: data.data.showProfileImage,
          isSignedIn: true,
        }

        dispatch(setUser(payload))
      } catch (error) {
        dispatch(clearUser())
        console.error("Error getting userId", error)
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", error.response?.data)
        }
      }
    }

    fetchUser()
  }, [])
}

export default useGetUser
