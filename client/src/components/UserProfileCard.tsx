import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Calendar } from "lucide-react";
import { correctDate } from "@/lib/correct-date";
import type { User as CurUser } from "shared";

interface IUserProfileCardProps {
  user: CurUser;
  removeAction: () => Promise<void>;
}

export const UserProfileCard = ({
  user,
  removeAction,
}: IUserProfileCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const initial = user?.username?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <ScrollArea className="max-h-[85vh] w-full">
        <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6">
          <Avatar
            className={`w-24 h-24 border border-border/40 shadow-sm mb-4 transition-opacity ${
              user.imageURL ? "cursor-pointer hover:opacity-90" : ""
            }`}
            onClick={() => user.imageURL && setIsOpen(true)}
          >
            <AvatarImage src={user.imageURL || ""} className="object-cover" />
            <AvatarFallback className="text-2xl bg-secondary/50 font-medium">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="text-center space-y-1 mb-8">
            <h2 className="text-lg font-medium tracking-tight text-foreground">
              {user.username}
            </h2>
            <p className="text-sm text-muted-foreground">
              @{user.username.toLowerCase()}
            </p>
          </div>

          <div className="w-full px-2">
            {user.createdAt && (
              <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-xl mb-4">
                <div className="flex items-center gap-3 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {correctDate(user.createdAt)}</span>
                </div>
              </div>
            )}

            <Button
              onClick={removeAction}
              variant="ghost"
              className="w-full justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-11"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete chat history
            </Button>
          </div>
        </div>
      </ScrollArea>

      {user.imageURL && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          plugins={[Zoom]}
          slides={[{ src: user.imageURL }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      )}
    </>
  );
};
