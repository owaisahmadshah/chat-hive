import { useState, useRef } from "react"
import { LogOut, Trash2, Camera, Check, X } from "lucide-react"
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
import { useSignOutUser } from "@/hooks/useSignOutUser"
import { useProfileImageUpdate } from "../hooks/useProfileImageUpdate"

const Profile = () => {
  const user = useSelector((state: RootState) => state.user)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { deleteUser } = useUserDelete()
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOutUser()
  const { mutateAsync: uploadProfileImage, isPending: isUploading } =
    useProfileImageUpdate()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpdateProfile = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append("profileImage", selectedFile)

    try {
      await uploadProfileImage(formData)
      cancelSelection()
    } catch (error) {
      console.error("Upload failed", error)
    }
  }

  const cancelSelection = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const isLoading = isSigningOut

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="w-10 h-10 cursor-pointer border border-border">
          <AvatarImage src={user.imageUrl} />
          <AvatarFallback>
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <ScrollArea className="h-[80vh]">
          <div className="p-6 space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 pt-6">
                <div className="relative group">
                  <Avatar className="w-32 h-32 cursor-pointer border-2 border-primary/10">
                    {/* Show previewUrl if it exists, otherwise show user.imageUrl */}
                    <AvatarImage
                      src={previewUrl || user.imageUrl}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-4xl">
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                  />

                  {!previewUrl ? (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 rounded-full shadow-lg"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="absolute -bottom-2 flex gap-2 w-full justify-center">
                      <Button
                        size="icon"
                        variant="default"
                        className="rounded-full h-8 w-8 bg-green-600 hover:bg-green-700"
                        onClick={handleUpdateProfile}
                        disabled={isUploading}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="rounded-full h-8 w-8"
                        onClick={cancelSelection}
                        disabled={isUploading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
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
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={async () => await signOut()}
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>

                <Button
                  variant="ghost"
                  onClick={deleteUser}
                  className="w-full justify-start text-destructive"
                  disabled={isLoading}
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
