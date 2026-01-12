import { fetchUser } from "../services/chatService"

export const fetchUserByUsername = async (username: string) => {
  try {
    const user = await fetchUser({ username })
    return { user, error: null }
  } catch (error) {
    console.error(error)
    return {
      user: null,
      error: "Error occured while fetching user by username.",
    }
  }
}
