import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { ImagePlus, Send, Paperclip } from "lucide-react"
import TextareaAutosize from "react-textarea-autosize"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { messageSchema } from "../types/message-schema"
import { useMessage } from "../hooks/useMessage"
import { Label } from "@/components/ui/label"
import { useSocketService } from "@/hooks/useSocketService"
import { cn } from "@/lib/utils"

function MessageInput() {
  const [isPictureSelected, setIsPictureSelected] = useState<boolean>(false)
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false)
  const [imageCount, setImageCount] = useState(0)

  const { sendNewMessage } = useMessage()
  const { sendSocketTyping } = useSocketService()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      userInputMessage: "",
      uploadedImage: undefined,
    },
  })

  const userInputMessage = form.watch("userInputMessage")

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    setIsSendingMessage(true)
    const formData = new FormData()
    formData.append("message", values.userInputMessage)

    if (values.uploadedImage && values.uploadedImage.length > 0) {
      for (let i = 0; i < values.uploadedImage.length; i++) {
        formData.append("uploadedImage", values.uploadedImage[i])
      }
    }

    if (
      values.userInputMessage.trim() === "" &&
      values?.uploadedImage === undefined
    ) {
      setIsSendingMessage(false)
      return
    }

    await sendNewMessage(formData)
    setIsSendingMessage(false)
    form.reset()
    setIsPictureSelected(false)
    setImageCount(0)
  }

  const setOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    form.setValue("uploadedImage", files || undefined)
    setIsPictureSelected(files !== null && files.length > 0)
    setImageCount(files?.length || 0)
  }

  const removePicture = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    form.setValue("uploadedImage", undefined)
    setIsPictureSelected(false)
    setImageCount(0)
  }

  const handleTypingBlur = () => {
    sendSocketTyping(false)
  }

  useEffect(() => {
    if (!userInputMessage) return

    sendSocketTyping(true)

    const typingTimeout = setTimeout(() => {
      sendSocketTyping(false)
    }, 1500)

    return () => clearTimeout(typingTimeout)
  }, [userInputMessage])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        form.handleSubmit(onSubmit)()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="border-t bg-background/95 backdrop-blur-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          autoComplete="off"
          className="p-4"
          encType="multipart/form-data"
        >
          <div className="flex items-center gap-3">
            {/* Image Upload Button */}
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    id="uploadedImage"
                    type="file"
                    className="hidden"
                    onChange={setOnChangePicture}
                    accept="image/*"
                    multiple
                  />
                  {!isPictureSelected ? (
                    <Label
                      htmlFor="uploadedImage"
                      className="cursor-pointer hover:bg-primary/10 transition-all duration-200 p-2.5 rounded-lg flex items-center justify-center group border border-transparent hover:border-primary/20"
                    >
                      <ImagePlus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Label>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={removePicture}
                      className="hover:bg-destructive/10 hover:text-destructive transition-all relative"
                    >
                      <Paperclip className="w-5 h-5" />
                      {imageCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                          {imageCount}
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* Message Input */}
            <FormField
              control={form.control}
              name="userInputMessage"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="relative">
                      <TextareaAutosize
                        {...field}
                        placeholder="Type your message..."
                        minRows={1}
                        maxRows={4}
                        onBlur={() => {
                          field.onBlur()
                          handleTypingBlur()
                        }}
                        className={cn(
                          "w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm",
                          "transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                          "placeholder:text-muted-foreground",
                          "resize-none"
                        )}
                        autoFocus
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Send Button */}
            <Button
              type="submit"
              disabled={
                isSendingMessage ||
                (!userInputMessage?.trim() && !isPictureSelected)
              }
              className={cn(
                "h-11 px-6 rounded-xl transition-all duration-200 group relative overflow-hidden",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:shadow-lg hover:shadow-primary/25"
              )}
            >
              {isSendingMessage ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  <span className="mr-2">Send</span>
                  <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default MessageInput
