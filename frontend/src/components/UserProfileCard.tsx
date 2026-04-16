import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

import { useState } from "react"
import { TUserReponse } from "shared"
import { ScrollArea } from "./ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

interface IUserProfileCardProps {
  user: TUserReponse
  removeAction: () => Promise<void>
}

export const UserProfileCard = ({
  user,
  removeAction,
}: IUserProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <ScrollArea className="max-h-[85vh]">
        <div className="flex flex-col">
          <div className="bg-muted/30 h-32 w-full flex items-center justify-center border-b border-border/40">
            <Avatar
              className="w-24 h-24 ring-4 ring-background shadow-xl cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setIsOpen(true)}
            >
              <AvatarImage src={user.imageUrl} className="object-cover" />
              <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="p-6 space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold text-foreground">
                {user.username}
              </h2>
              <p className="text-sm text-muted-foreground font-medium">
                @{user.username}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <Button
                onClick={removeAction}
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 gap-3 h-12 rounded-xl"
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-semibold">Delete Chat history</span>
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        plugins={[Zoom]}
        slides={[{ src: user.imageUrl }]}
        render={{
          buttonPrev: () => null, // Hide navigation if there's only one image
          buttonNext: () => null,
        }}
      />
    </>
  )
}
