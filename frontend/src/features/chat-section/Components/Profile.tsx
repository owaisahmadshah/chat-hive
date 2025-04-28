import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import { ScrollArea } from "@/components/ui/scroll-area"


const Profile = () => {
  const { imageUrl, email } = useSelector((state: RootState) => state.user)

  return (
    <main className="py-5 border-r h-[100vh]">
      <ScrollArea className="w-full h-[95vh]">
        <ul className="flex flex-col items-center gap-4">
          <li>
            <img
              src={imageUrl}
              alt={""}
              className="max-w-[200px] max-h-[200px] rounded-full"
            />
          </li>
          <li><strong>{email}</strong></li>
        </ul>
      </ScrollArea>
    </main>
  )
}

export default Profile
