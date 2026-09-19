import { useState, useRef } from "react";
import { LogOut, Trash2, Camera, Loader2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { useUserDelete } from "@/hooks/useUserDelete";
import { useUser } from "@/context/user-context";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";
import { useUserProfilePicture } from "@/hooks/useUserProfilePicture";

export const Profile = () => {
  const { state } = useUser();
  const { user } = state;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: deleteUser } = useUserDelete();
  const { mutateAsync: signOut, isPending: isSigningOut } = useSignOut();
  const { mutateAsync: updateProfileImage } = useUserProfilePicture();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      const { url } = await uploadToCloudinary(selectedFile);

      await updateProfileImage({ imageURL: url });
      cancelSelection();
    } catch (error) {
      console.error("Failed to update profile image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isLoading = isSigningOut || isUploading;

  if (!user) return null;

  const displayImage = previewUrl || user.imageURL;

  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Avatar className="w-10 h-10 cursor-pointer border border-border/50 hover:opacity-80 transition-opacity">
            <AvatarImage src={user.imageURL || ""} />
            <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DialogTrigger>

        <DialogContent className="sm:max-w-sm p-0 gap-0 overflow-hidden bg-background">
          <ScrollArea className="max-h-[85vh]">
            <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6 relative">
              <div className="relative group mb-4">
                <Avatar
                  className={`w-24 h-24 border border-border/40 shadow-sm transition-opacity ${displayImage ? "cursor-pointer hover:opacity-90" : ""}`}
                  onClick={() => displayImage && setIsLightboxOpen(true)}
                >
                  <AvatarImage
                    src={displayImage || ""}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-secondary/50 font-medium">
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

                {!previewUrl && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 shadow-sm border border-background bg-secondary hover:bg-secondary/80 transition-transform hover:scale-105"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="w-4 h-4 text-secondary-foreground" />
                  </Button>
                )}
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-lg font-medium tracking-tight text-foreground">
                  {user.username}
                </h2>
                <p className="text-sm text-muted-foreground">
                  @{user.username}
                </p>
              </div>

              {previewUrl && (
                <div className="flex items-center gap-2 mt-6">
                  <Button
                    size="sm"
                    onClick={handleUpdateProfile}
                    disabled={isUploading}
                    className="w-24 h-8 text-xs font-medium"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Save Photo"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={cancelSelection}
                    disabled={isUploading}
                    className="w-24 h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <div className="px-2 pb-2">
              <div className="flex flex-col gap-1 p-4 bg-muted/30 rounded-xl mx-4 mb-4">
                <div className="flex justify-between items-center py-2 px-2">
                  <span className="text-sm font-medium text-foreground">
                    Theme
                  </span>
                  <ModeToggle />
                </div>
              </div>

              <div className="flex flex-col gap-1 px-4 pb-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 h-11"
                  onClick={() => signOut()}
                  disabled={isLoading}
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign out
                </Button>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive/80 hover:text-destructive hover:bg-destructive/10 h-11"
                  onClick={() => deleteUser()}
                  disabled={isLoading}
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete account
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {displayImage && (
        <Lightbox
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          plugins={[Zoom]}
          slides={[{ src: displayImage }]}
          render={{
            buttonPrev: () => null,
            buttonNext: () => null,
          }}
        />
      )}
    </>
  );
};
