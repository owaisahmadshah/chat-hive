import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Send, X, Plus, Camera, FileText, Music, Video } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useCreateMessage } from "../hooks/useCreateMessage";
import { useChatActions } from "@/hooks/useChatActions";
import { uploadToCloudinary } from "@/lib/upload-to-cloudinary";

interface IMessageInputProps {
  activeChatId: string;
  userId: string;
}

const formSchema = z.object({
  userInputMessage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function getFileKind(file: File): "image" | "video" | "audio" | "file" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return "file";
}

export function MessageInput({ activeChatId, userId }: IMessageInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const sendMessage = useCreateMessage();

  const { sendTyping } = useChatActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInputMessage: "",
    },
  });

  const userInputMessage = form.watch("userInputMessage");

  const previewUrls = useMemo(() => {
    return selectedFiles.map((file) => URL.createObjectURL(file));
  }, [selectedFiles]);

  const imageIndexes = useMemo(
    () =>
      selectedFiles.reduce<number[]>((acc, file, i) => {
        if (getFileKind(file) === "image") acc.push(i);
        return acc;
      }, []),
    [selectedFiles],
  );

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  const handleSendTyping = useCallback(
    (isTyping: boolean) => {
      sendTyping({
        userId,
        chatId: activeChatId,
        isTyping,
      });
    },
    [sendTyping, userId, activeChatId],
  );

  useEffect(() => {
    if (!userInputMessage || userInputMessage.trim() === "") {
      handleSendTyping(false);
      return;
    }

    handleSendTyping(true);

    const typingTimeout = setTimeout(() => {
      handleSendTyping(false);
    }, 1500);

    return () => clearTimeout(typingTimeout);
  }, [userInputMessage, handleSendTyping]);

  const handleTypingBlur = () => {
    handleSendTyping(false);
  };

  async function onSubmit(values: FormValues) {
    const textContent = values.userInputMessage?.trim() || "";
    if (!textContent && selectedFiles.length === 0) return;

    handleSendTyping(false);

    try {
      setIsSendingMessage(true);

      const attachments = await Promise.all(
        selectedFiles.map((file) => uploadToCloudinary(file)),
      );

      await sendMessage({
        chatId: activeChatId,
        senderId: userId,
        text: textContent || null,
        attachments,
      });

      form.reset({ userInputMessage: "" });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Message failed to send", {
        description: "Check your connection and try again.",
      });
    } finally {
      setIsSendingMessage(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files);
    const accepted: File[] = [];

    for (const file of newFiles) {
      const kind = getFileKind(file);
      const limit = kind === "video" ? MAX_VIDEO_SIZE : MAX_FILE_SIZE;

      if (file.size > limit) {
        toast.warning(`"${file.name}" is too large`, {
          description: `Max size is ${Math.round(limit / (1024 * 1024))}MB.`,
        });
        continue;
      }

      accepted.push(file);
    }

    if (accepted.length > 0) {
      setSelectedFiles((prev) => [...prev, ...accepted]);
    }

    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => setSelectedFiles([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="shrink-0 bg-background/95 backdrop-blur-sm border-t border-border/50 rounded-t shadow-2xl">
      {selectedFiles.length > 0 && (
        <div className="px-2 pt-3 pb-1 md:px-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-medium text-muted-foreground">
              {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "file" : "files"} attached
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFiles}
              className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              Clear all
            </Button>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {selectedFiles.map((file, index) => {
              const kind = getFileKind(file);
              const url = previewUrls[index];

              return (
                <div key={url} className="group relative flex-shrink-0">
                  {kind === "image" && (
                    <img
                      src={url}
                      alt="preview"
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl shadow-sm shadow-black/10 ring-1 ring-black/5 transition-all duration-200 group-hover:shadow-md group-hover:ring-primary/30 cursor-pointer"
                      onClick={() => {
                        setActiveImageIndex(imageIndexes.indexOf(index));
                        setIsLightboxOpen(true);
                      }}
                    />
                  )}

                  {kind === "video" && (
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-sm shadow-black/10 ring-1 ring-black/5 bg-black">
                      <video
                        src={url}
                        className="w-full h-full object-cover opacity-80"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="w-5 h-5 text-white drop-shadow" />
                      </div>
                    </div>
                  )}

                  {kind === "audio" && (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted/60 ring-1 ring-black/5 flex flex-col items-center justify-center gap-1 px-1.5">
                      <Music className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground text-center truncate w-full">
                        {file.name}
                      </span>
                    </div>
                  )}

                  {kind === "file" && (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted/60 ring-1 ring-black/5 flex flex-col items-center justify-center gap-1 px-1.5">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <span className="text-[9px] text-muted-foreground text-center truncate w-full">
                        {file.name}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-foreground text-background shadow-sm transition-all duration-150 opacity-0 group-hover:opacity-100 hover:scale-110 hover:bg-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}

            <Label
              htmlFor="addMoreImages"
              className="flex-shrink-0 cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-muted/40 flex items-center justify-center text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <Input
                id="addMoreImages"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
                multiple
              />
            </Label>
          </div>
        </div>
      )}

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="p-2 md:p-4 flex items-center gap-1.5 md:gap-3"
      >
        <div className="flex-shrink-0 flex items-center self-center">
          <Input
            id="uploadedImage"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
            multiple
          />
          <Label
            htmlFor="uploadedImage"
            className="cursor-pointer flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-2xl bg-muted/40 text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
          >
            <Camera className="w-4 h-4 md:w-5 md:h-5" />
          </Label>
        </div>

        <FieldGroup className="flex-1">
          <Controller
            name="userInputMessage"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full">
                <TextareaAutosize
                  {...field}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  minRows={1}
                  maxRows={5}
                  onBlur={() => {
                    field.onBlur();
                    handleTypingBlur();
                  }}
                  className={cn(
                    "w-full rounded-2xl border border-input bg-muted/30 px-4 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background resize-none leading-relaxed",
                  )}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button
          type="submit"
          disabled={
            (!userInputMessage?.trim() && selectedFiles.length === 0) ||
            isSendingMessage
          }
          className={cn(
            "group relative h-10 w-10 md:h-11 md:w-11 flex-shrink-0 rounded-2xl p-0",
            "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
            "shadow-md shadow-primary/25 transition-all duration-200 ease-out",
            "hover:shadow-lg hover:shadow-primary/35 hover:scale-105",
            "active:scale-90 active:shadow-sm active:duration-75",
            "disabled:scale-100 disabled:bg-none disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
          )}
        >
          <Send className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-active:translate-x-0 group-active:translate-y-0" />
        </Button>
      </form>

      {imageIndexes.length > 0 && (
        <Lightbox
          index={activeImageIndex}
          open={isLightboxOpen}
          close={() => setIsLightboxOpen(false)}
          slides={imageIndexes.map((i) => ({ src: previewUrls[i] }))}
          plugins={[Zoom, Download]}
        />
      )}
    </div>
  );
}
