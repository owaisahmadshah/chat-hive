import { useAuth } from "@clerk/clerk-react"
import { useEffect, useState } from "react"

const useCustomAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoaded, isSignedIn } = useAuth()

  useEffect(() => {
    if (!isLoaded) {
      return
    }

    setIsLoading(false)
    setIsAuthenticated(isSignedIn)
  }, [isLoaded, isSignedIn])

  return { isAuthenticated, isLoading }
}

export default useCustomAuth
