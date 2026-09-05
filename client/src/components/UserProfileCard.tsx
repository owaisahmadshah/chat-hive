import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, ShieldCheck, Mail, User } from "lucide-react";
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
        <div className="flex flex-col">
          <div className="relative bg-gradient-to-tr from-primary/30 via-primary/10 to-muted h-36 w-full flex items-end justify-center pb-0 border-b border-border/40">
            <div className="absolute top-3 right-3">
              <Badge
                variant="secondary"
                className="gap-1 bg-background/80 backdrop-blur-md"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Verified
                User
              </Badge>
            </div>

            <div className="translate-y-10 relative">
              <Avatar
                className="w-24 h-24 ring-4 ring-background shadow-2xl cursor-pointer hover:opacity-90 transition-all hover:scale-105"
                onClick={() => user.imageURL && setIsOpen(true)}
              >
                <AvatarImage
                  src={user.imageURL || undefined}
                  className="object-cover"
                />
                <AvatarFallback className="text-3xl font-extrabold bg-primary text-primary-foreground">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="pt-14 p-6 space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {user.username}
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                @{user.username.toLowerCase()}
              </p>
            </div>

            <div className="space-y-2 bg-muted/30 p-4 rounded-2xl border border-border/50 text-sm">
              <div className="flex items-center gap-3 py-1.5 text-muted-foreground">
                <User className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate text-foreground font-medium">
                  {user.username}
                </span>
              </div>

              {user.email && (
                <div className="flex items-center gap-3 py-1.5 text-muted-foreground border-t border-border/30">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span className="truncate text-foreground font-medium">
                    {user.email}
                  </span>
                </div>
              )}

              {user.createdAt && (
                <div className="flex items-center gap-3 py-1.5 text-muted-foreground border-t border-border/30">
                  <Calendar className="w-4 h-4 text-primary shrink-0" />
                  <span>Joined {correctDate(user.createdAt)}</span>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-border/40">
              <Button
                onClick={removeAction}
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 gap-3 h-11 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-semibold text-sm">
                  Delete Chat history
                </span>
              </Button>
            </div>
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
