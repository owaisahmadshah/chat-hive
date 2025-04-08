import api from "@/lib/axiosInstance"

const sendMessage = async (formData: FormData) => {
  const { data } = await api.post("/v1/message/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data
}

const deleteMessageService = async (messageBody: {
  messageId: string
  userId: string
}) => {
  const { data } = await api.post("/v1/message/delete", messageBody)
  return data
}

export { sendMessage, deleteMessageService }
