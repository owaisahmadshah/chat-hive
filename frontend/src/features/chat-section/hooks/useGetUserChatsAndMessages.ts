import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

import api from "@/lib/axiosInstance"
import { RootState } from "@/store/store"
import { setChats } from "@/store/slices/chats"
import { setMessages } from "@/store/slices/messages"
import { socketService } from "@/lib/socketService"

function useGetUserChatsAndMessages() {
  const { getToken } = useAuth()

  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  // When user opens website we will fetch his userId and details
  useEffect(() => {
    let isMounted = true

    if (!user.isLoading && user.userId) {
      ;(async () => {
        try {
          const token = await getToken()

          // Stop if component is unmounted
          if (!isMounted) {
            return
          }

          const { data } = await api.post(
            "/v1/chat/get",
            { userId: user.userId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (isMounted && data.statusCode === 200) {
            const allChatsAndMessages = [...data.data]
            let allChats = new Array()

            /**
             * Store chats in a separate array and store messages
             * Filter chats and messages
             * in a map whose key will be
             * */
            allChatsAndMessages.forEach((chatAndMessages) => {
              const { messages, ...chat } = chatAndMessages
              allChats.push(chat)
              socketService.joinChat(chat._id) //* Join chat in socket server
              dispatch(setMessages({ chatId: chat._id, messages }))
            })
            dispatch(setChats(allChats))
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
  }, [user?.userId])
}

export default useGetUserChatsAndMessages
