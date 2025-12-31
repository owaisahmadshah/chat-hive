import {
  User,
  Shield,
  Eye,
  Clock,
  ImageIcon,
  CheckCheck,
  HelpCircle,
  LogOut,
  Trash2,
  Camera,
} from "lucide-react"

import { useSelector } from "react-redux"
import { RootState } from "@/store/store"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import useUserDelete from "@/hooks/useUserDelete"
import { useUser } from "../hooks/useUser"

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Profile = () => {
  const user = useSelector((state: RootState) => state.user)
  const { updateUserField } = useUser()
  const { deleteUser } = useUserDelete()

  const PrivacyDropdown = ({
    field,
    value,
  }: {
    field: string
    value: string
    icon: React.ElementType
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 px-4 hover:bg-primary/10 rounded-full"
        >
          <span className="text-sm capitalize font-medium">{value}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => updateUserField({ field, fieldValue: "private" })}
            className="cursor-pointer"
          >
            <Shield className="w-4 h-4 mr-2" />
            Private
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateUserField({ field, fieldValue: "public" })}
            className="cursor-pointer"
          >
            <Eye className="w-4 h-4 mr-2" />
            Public
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => updateUserField({ field, fieldValue: "contacts" })}
            className="cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Contacts
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )

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
                        alt={user.username}
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
                      {user.username}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      @{user.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="border-muted/40 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    Privacy Settings
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">About</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Who can see your bio
                        </p>
                      </div>
                    </div>
                    <PrivacyDropdown
                      field="showAbout"
                      value={user.showAbout}
                      icon={Eye}
                    />
                  </div>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Seen</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Who can see when you're online
                        </p>
                      </div>
                    </div>
                    <PrivacyDropdown
                      field="showLastSeen"
                      value={user.showLastSeen}
                      icon={Clock}
                    />
                  </div>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Who can see your photo
                        </p>
                      </div>
                    </div>
                    <PrivacyDropdown
                      field="showProfileImage"
                      value={user.showProfileImage}
                      icon={ImageIcon}
                    />
                  </div>

                  <Separator className="my-1" />

                  <div className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <CheckCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Read Receipts</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Show when you've read messages
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 px-4 hover:bg-primary/10 rounded-full"
                        >
                          <span className="text-sm capitalize font-medium">
                            {user.isReadReceipts ? "On" : "Off"}
                          </span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() =>
                            updateUserField({
                              field: "isReadReceipts",
                              fieldValue: !user.isReadReceipts,
                            })
                          }
                          className="cursor-pointer"
                        >
                          {user.isReadReceipts ? "Turn Off" : "Turn On"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
