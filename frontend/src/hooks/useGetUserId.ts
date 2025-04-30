import { useAuth, useUser } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"

import { setUser } from "@/store/slices/user"
import { User } from "@/types/user-interface"
import { getUser } from "@/services/userService"

/**
 * @desc Custom hook that fetches and manages user data from the backend
 *
 * This hook:
 * 1. Checks if the user is signed in
 * 2. Fetches the user's details from the backend
 * 3. Updates the Redux store with the user's information
 *
 * @returns {void}
 *
 * @example
 * Usage in a component
 * useGetUserId()
 */
function useGetUserId() {
  const { isSignedIn, user } = useUser()

  const { getToken } = useAuth()

  const dispatch = useDispatch()

  // When user opens website we will fetch his userId and details
  useEffect(() => {
    let isMounted = true

    if (!isSignedIn || !user?.id || !isMounted) {
      return
    }

    const fetchUser = async (userId: string) => {
      try {
        const token = await getToken()

        const data = await getUser(userId, token)

        if (data.statusCode !== 200) {
          return
        }

        const payload: User = {
          email: data.data.email,
          username: data.data.username,
          userId: data.data._id,
          imageUrl: data.data.imageUrl,
          isLoading: false,
        }

        dispatch(setUser(payload))
      } catch (error) {
        console.error("Error getting userId", error)
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", error.response?.data)
        }
      }
    }

    fetchUser(user.id)
    return () => {
      isMounted = false
    }
  }, [isSignedIn, user?.id])
}

export default useGetUserId
