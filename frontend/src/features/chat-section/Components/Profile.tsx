import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EditAboutButton } from "./EditAboutButton"

const Profile = () => {
  const { imageUrl, username, about } = useSelector(
    (state: RootState) => state.user
  )

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
          <li>
            <strong>{username}</strong>
          </li>
          <li className="flex items-center">
            <EditAboutButton />
            <p className="text-sm">
              <strong>About: </strong>
              {about.length > 0 ? about : ""}
            </p>
          </li>
        </ul>
      </ScrollArea>
    </main>
  )
}

export default Profile
