import { RootState } from "@/store/store"
import { useSelector } from "react-redux"

const useRequireAuth = () => {
  const user = useSelector((state: RootState) => state.user)
  return { ...user }
}

export default useRequireAuth
