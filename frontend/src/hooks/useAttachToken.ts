import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"

import { attachTokenToApi } from "@/lib/axiosInstance"

const useAttachToken = () => {
  const { getToken } = useAuth()

  useEffect(() => {
    const setup = async () => {
      const token = await getToken()
      if (token) attachTokenToApi(token)
    }

    setup()
  }, [])
  return
}

export default useAttachToken
