import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import { ScrollArea } from "@/components/ui/scroll-area"


const Profile = () => {
  const user = useSelector((state: RootState) => state.user)

  return (
    <main className="py-5 border-r h-[100vh]">
      <ScrollArea className="w-full h-[95vh]">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <img
              src={user.imageUrl}
              alt={""}
              className="max-w-[200px] max-h-[200px] rounded-full"
            />
          </li>
          <li className="flex flex-col">
            <strong>{user.fullName}</strong>
            <p className="text-xs">(Only you can see your name)</p>
          </li>
          <li>{user.email}</li>
        </ul>
      </ScrollArea>
    </main>
  )
}

export default Profile
