import { getFriends } from "@/services/friendService"
import { setFriends } from "@/store/slices/friend"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useGetFriends = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const { data } = await getFriends()

        dispatch(setFriends(data.friends))
      } catch (error) {
        console.error("Error while fetching friends", error)
      }
    }

    fetchFriends()
  }, [])
}

export default useGetFriends
