import { getFriends } from "@/services/friendService"
import { setFriends } from "@/store/slices/friend"
import { RootState } from "@/store/store"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const useGetFriends = () => {
  const dispatch = useDispatch()
  const { getToken } = useAuth()

  const { userId } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (userId === "") {
      return
    }

    const fetchFriends = async () => {
      const token = await getToken()

      try {
        const { data } = await getFriends({ userId }, token)

        dispatch(setFriends(data.friends))
      } catch (error) {
        console.error("Error while fetching friends", error)
      }
    }

    fetchFriends()
  }, [userId, getToken])
}

export default useGetFriends
