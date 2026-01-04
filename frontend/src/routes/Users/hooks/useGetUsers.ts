import { useEffect } from "react"
import { useDispatch } from "react-redux"

import { getRecommendedUsers } from "../services/userService"
import { IConnection } from "@/types/connection-interface"
import { addConnections, clearConnections } from "@/store/slices/connection"
import axios from "axios"

export const useGetRecommendedUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getRecommendedUsers()
        console.log(data)

        if (data.statusCode !== 200) {
          return
        }

        const payload: IConnection[] = []

        for (let i = 0; i < data.data.length; i++) {
          const user: IConnection = {
            _id: data.data[i]._id,
            email: data.data[i].email,
            username: data.data[i].username,
            imageUrl: data.data[i].imageUrl,
            about: data.data[i].about,
            showAbout: data.data[i].showAbout,
            showLastSeen: data.data[i].showLastSeen,
            isReadReceipts: data.data[i].isReadReceipts,
            showProfileImage: data.data[i].showProfileImage,
          }
          payload.push(user)
        }

        dispatch(addConnections(payload))
      } catch (error) {
        dispatch(clearConnections())
        console.error("Error adding connections", error)
        if (axios.isAxiosError(error)) {
          console.error("Axios error details:", error.response?.data.message)
        }
      }
    }

    fetchUser()
  }, [])
}
