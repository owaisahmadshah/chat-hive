import CreateChat from "./CreateChat"
import Profile from "./Profile"

const ChatNavbar = () => {
  return (
    <ul className="h-[15dvh] flex justify-between items-center p-5 bg-background border-r">
      <li>
        <Profile />
        {/* hello */}
      </li>
      <li className="flex">
        <CreateChat />
      </li>
    </ul>
  )
}

export default ChatNavbar
