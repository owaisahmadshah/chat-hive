import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ModeToggle } from "@/components/mode-toggle"
import {
  User,
  Shield,
  Eye,
  Clock,
  Image as ImageIcon,
  CheckCheck,
  HelpCircle,
  LogOut,
  Trash2,
  Camera,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import useUserDelete from "@/hooks/useUserDelete"
import { useUser } from "../hooks/useUser"
import { EditAboutButton } from "./EditAboutButton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Profile = () => {
  const user = useSelector((state: RootState) => state.user)
  const { updateUserField } = useUser()
  const { deleteUser } = useUserDelete()

  const PrivacyDropdown = ({
    field,
    value,
    // icon: Icon,
  }: {
    field: string
    value: string
    icon: React.ElementType
  }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 px-3 hover:bg-primary/10">
          <span className="text-sm capitalize">{value}</span>
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
    <main className="border-r h-screen bg-gradient-to-b from-background to-muted/5">
      <ScrollArea className="h-full">
        <div className="p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Shield className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* PROFILE TAB */}
            <TabsContent
              value="profile"
              className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* Profile Header */}
              <Card className="border-muted/40 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20" />
                <CardContent className="relative pb-6">
                  <div className="flex flex-col items-center -mt-16">
                    <div className="relative group">
                      <img
                        src={user.imageUrl}
                        alt={user.username}
                        className="w-28 h-28 rounded-full ring-4 ring-background object-cover"
                      />
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 rounded-full w-9 h-9 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>

                    <h2 className="mt-4 text-2xl font-bold">{user.username}</h2>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* About Section */}
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    About
                    <EditAboutButton />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {user.about ||
                      "No bio added yet. Tell others about yourself!"}
                  </p>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-muted/40">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">0</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Messages
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-muted/40">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">0</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Contacts
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent
              value="settings"
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              {/* Privacy Settings */}
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control who can see your information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">About</p>
                        <p className="text-xs text-muted-foreground">
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
                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Last Seen</p>
                        <p className="text-xs text-muted-foreground">
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
                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">
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
                  <Separator />

                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CheckCheck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Read Receipts</p>
                        <p className="text-xs text-muted-foreground">
                          Show when you've read messages
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-9 px-3 hover:bg-primary/10"
                        >
                          <span className="text-sm capitalize">
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
              <Card className="border-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                  <CardDescription>
                    Customize how Chat Hive looks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">
                        Choose light or dark mode
                      </p>
                    </div>
                    <ModeToggle />
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="border-muted/40">
                <CardContent className="pt-6">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary/10"
                  >
                    <HelpCircle className="w-5 h-5 mr-3" />
                    Help & Support
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-lg text-destructive">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Irreversible actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Sign Out
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={deleteUser}
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-5 h-5 mr-3" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </main>
  )
}

export default Profile
