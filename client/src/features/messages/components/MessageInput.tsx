import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";
import "yet-another-react-lightbox/styles.css";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState, useMemo } from "react";
import { ImagePlus, Send, X, Plus, Trash2 } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useCreateMessage } from "../hooks/useCreateMessage";

interface IMessageInputProps {
  activeChatId: string;
  userId: string;
}

const formSchema = z.object({
  userInputMessage: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function MessageInput({ activeChatId, userId }: IMessageInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const sendMessage = useCreateMessage();

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

  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [previewUrls]);

  async function onSubmit(values: FormValues) {
    const textContent = values.userInputMessage?.trim() || "";
    if (!textContent && selectedFiles.length === 0) return;

    try {
      setIsSendingMessage(true);
      await sendMessage({
        chatId: activeChatId,
        senderId: userId,
        text: textContent || null,
        attachments: [],
      });

      form.reset({ userInputMessage: "" });
      setSelectedFiles([]);
      setIsSendingMessage(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      setIsSendingMessage(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    if (activeImageIndex >= selectedFiles.length - 1) {
      setActiveImageIndex(Math.max(0, selectedFiles.length - 2));
    }
  };

  const clearAllImages = () => setSelectedFiles([]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="shrink-0 bg-background/95 backdrop-blur-sm border-t border-border/50 rounded-t-2xl shadow-2xl">
      {/* Image Preview List */}
      {selectedFiles.length > 0 && (
        <div className="px-2 pt-3 pb-1 md:px-4">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {selectedFiles.length}{" "}
              {selectedFiles.length === 1 ? "Image" : "Images"} Selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllImages}
              className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear All
            </Button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {previewUrls.map((url, index) => (
              <div key={url} className="relative group flex-shrink-0">
                <img
                  src={url}
                  alt="preview"
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-muted hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => {
                    setActiveImageIndex(index);
                    setIsLightboxOpen(true);
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute -top-1.5 -right-1.5 bg-background border border-border text-foreground rounded-full p-1 shadow-md hover:bg-destructive hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}

            <div className="flex gap-2 items-center pl-1">
              <Label
                htmlFor="addMoreImages"
                className="cursor-pointer bg-muted/50 hover:bg-primary/10 text-primary w-16 h-16 md:w-20 md:h-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center transition-all"
              >
                <Plus className="w-6 h-6" />
                <Input
                  id="addMoreImages"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  multiple
                />
              </Label>
            </div>
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
            accept="image/*"
            multiple
          />
          <Label
            htmlFor="uploadedImage"
            className="cursor-pointer hover:bg-muted text-muted-foreground hover:text-primary transition-all p-2 rounded-full"
          >
            <ImagePlus className="w-5 h-5 md:w-6 md:h-6" />
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
            "h-10 w-10 md:h-11 md:w-11 rounded-full p-0 flex-shrink-0 transition-all",
            "bg-primary text-primary-foreground shadow-sm hover:shadow-primary/20",
            "disabled:bg-muted disabled:text-muted-foreground",
          )}
        >
          <Send className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </form>

      <Lightbox
        index={activeImageIndex}
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={previewUrls.map((url) => ({ src: url }))}
        plugins={[Zoom, Download]}
      />
    </div>
  );
}
