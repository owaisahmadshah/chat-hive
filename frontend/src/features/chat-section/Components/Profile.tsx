import { LogOut, Trash2, Camera } from "lucide-react"
import { useSelector } from "react-redux"

import { RootState } from "@/store/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import useUserDelete from "@/hooks/useUserDelete"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Profile = () => {
  const user = useSelector((state: RootState) => state.user)
  const { deleteUser } = useUserDelete()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="w-10 h-10 cursor-pointer">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[80vh]">
          <div className="p-6 space-y-6">
            {/* Profile */}
            <Card>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Avatar className="w-42 h-42 cursor-pointer">
                    <AvatarImage src={user.imageUrl} />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute bottom-0 right-0 hover:bg-secondary/80"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center">
                  <h2 className="text-xl font-semibold">{user.username}</h2>
                  <p className="text-sm text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Change theme</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <span>Theme</span>
                <ModeToggle />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>

              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>

                <Button
                  variant="ghost"
                  onClick={deleteUser}
                  className="w-full justify-start text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
