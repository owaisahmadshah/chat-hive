import axios from "axios"

import {
  updateMessagesStatusService,
  updateMessageStatusService,
} from "@/services/messageGlobalService"

const useMessageGlobalHook = () => {
  const updateMessagesStatus = async (
    chatId: string,
    status: "receive" | "seen"
  ) => {
    try {
      await updateMessagesStatusService({
        chatId,
        status,
      })
    } catch (error) {
      console.error("Error updating messages status", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }

  const updateMessageStatus = async (
    messageId: string,
    status: "receive" | "seen"
  ) => {
    try {
      await updateMessageStatusService({
        messageId,
        status,
      })
    } catch (error) {
      console.error("Error updating message status", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
  }
  return { updateMessageStatus, updateMessagesStatus }
}

export default useMessageGlobalHook
