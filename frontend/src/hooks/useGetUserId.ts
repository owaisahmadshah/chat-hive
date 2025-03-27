import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"

import { setUser } from "@/store/slices/user"
import { User } from "@/types/user-interface"
import api from "@/lib/axiosInstance"

function useGetUserId() {
  const { isSignedIn, user } = useUser()
  const { getToken } = useAuth()

  const dispatch = useDispatch()

  // When user opens website we will fetch his userId and details
  useEffect(() => {
    let isMounted = true

    if (isSignedIn && user?.id) {
      ;(async () => {
        try {
          const token = await getToken()

          // Stop if component is unmounted
          if (!isMounted) {
            return
          }

          const { data } = await api.post(
            "/v1/webhook/user",
            { clerkId: user.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (isMounted && data.statusCode === 200) {
            const payload: User = {
              email: data.data.email,
              userId: data.data._id,
              fullName: data.data.fullName,
              imageUrl: data.data.imageUrl,
              isLoading: false,
            }
            dispatch(setUser(payload))
          }
        } catch (error) {
          console.error("Error getting userId", error)
          if (axios.isAxiosError(error)) {
            console.error("Axios error details:", error.response?.data)
          }
        }
      })()
    }
    return () => {
      isMounted = false
    }
  }, [isSignedIn, user?.id, getToken])
}

export default useGetUserId
