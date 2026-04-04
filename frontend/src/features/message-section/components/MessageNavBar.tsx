import { ArrowLeft } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useFetchChatUser } from "../hooks/useFetchChatUser"
import correctDate from "@/lib/correct-date"

const MessageNavBar = ({
  setValue,
}: {
  setValue: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const { data: chatUser, isLoading, error } = useFetchChatUser()

  if (isLoading) {
    return <div className="w-full h-16 min-h-16">Loading chat user...</div>
  }

  if (error) {
    return <div className="w-full h-16 min-h-16">Something went wrong</div>
  }

  return (
    <Dialog>
      <div className="w-full h-16 min-h-16 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className={cn("sm:hidden")}
            onClick={() => setValue(false)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <DialogTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer hover:bg-muted/50 p-2 rounded-lg transition-all">
              <Avatar className="w-10 h-10 ring-2 ring-background">
                <AvatarImage
                  src={
                    chatUser.showProfileImage === "public"
                      ? chatUser.imageUrl
                      : "./default-image.png"
                  }
                />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {chatUser.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <strong className="text-sm font-semibold">
                  {chatUser.username}
                </strong>
                <p className="text-xs text-muted-foreground">
                  {chatUser?.isTyping ? (
                    <span className="text-primary">typing...</span>
                  ) : chatUser?.isUserOnline ? (
                    <span className="text-green-500">online</span>
                  ) : (
                    chatUser.updatedAt && correctDate(chatUser.updatedAt)
                  )}
                </p>
              </div>
            </div>
          </DialogTrigger>
        </div>
      </div>

      <DialogContent className="flex flex-col items-center gap-6 p-6">
        <Avatar className="w-32 h-32 ring-4 ring-primary/20">
          <AvatarImage src={chatUser.imageUrl} />
          <AvatarFallback className="text-4xl bg-primary/10 text-primary">
            {chatUser.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="text-center space-y-2">
          <DialogTitle className="text-2xl font-bold">
            {chatUser.username}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {// selectedChat?.typing?.isTyping ? (
                //   "Typing..."
                // ) : chatUser.isUserOnline ? (
                //   <span className="text-green-500">Online</span>
                "Offline"}
            Offline
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <Button variant="destructive" className="flex-1">
            Delete Chat
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MessageNavBar
