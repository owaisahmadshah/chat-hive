import { Shield, HelpCircle, LogOut, Trash2, Camera } from "lucide-react"

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
        <Avatar className="w-10 h-10 ring-2 ring-background cursor-pointer">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <main className="h-[85vh] bg-gradient-to-br from-background via-background to-muted/20">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <Card className="border-muted/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/15 to-primary/5 relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-white/10" />
                </div>
                <CardContent className="relative pb-8">
                  <div className="flex flex-col items-center -mt-20">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                      <img
                        src={user.imageUrl}
                        alt={user.username[0].toUpperCase()}
                        className="relative w-32 h-32 rounded-full ring-4 ring-background object-cover shadow-xl"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-1 right-1 rounded-full w-10 h-10 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold tracking-tight">
                      {user.username.toUpperCase()}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      @{user.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="border-muted/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription className="mt-1">
                    Customize how Chat Hive looks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Choose light or dark mode
                      </p>
                    </div>
                    <ModeToggle />
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="border-muted/40 shadow-sm">
                <CardContent className="p-3">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary/10 h-12 rounded-lg"
                  >
                    <HelpCircle className="w-5 h-5 mr-3" />
                    <span className="font-medium">Help & Support</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/30 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-destructive flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-destructive" />
                    </div>
                    Danger Zone
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Irreversible actions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive h-12 rounded-lg"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    <span className="font-medium">Sign Out</span>
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={deleteUser}
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive h-12 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 mr-3" />
                    <span className="font-medium">Delete Account</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </main>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
