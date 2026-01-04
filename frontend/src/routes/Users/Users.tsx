import { useSelector } from "react-redux"
import { useGetRecommendedUser } from "./hooks/useGetUsers"
import { RootState } from "@/store/store"

export const Users = () => {
  useGetRecommendedUser()

  const { connection } = useSelector((state: RootState) => state)
  console.log(connection)

  return <div>User</div>
}
