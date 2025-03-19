import axios from "axios"
import { useAuth } from "@clerk/clerk-react"

import { fetchUser } from "../services/chatService"

const useChat = () => {
  const { getToken } = useAuth()

  // This function will fetch users based on the search query of the user
  const fetchUsers = async (email: string) => {
    try {
      const token = await getToken()
      const data = await fetchUser({ email }, token)
      return data.data.users
    } catch (error) {
      console.error("Error fetching users", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
      return []
    }
  }
  return { fetchUsers }
}

export { useChat }
