import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import TextareaAutosize from 'react-textarea-autosize'

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

  const { sendNewMessage } = useMessage()
  const { sendSocketTyping } = useSocketService()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      userInputMessage: "",
      uploadedImage: undefined
    },
  })

  const userInputMessage = form.watch("userInputMessage")

  async function onSubmit(values: z.infer<typeof messageSchema>) {

    const formData = new FormData()
    formData.append("message", values.userInputMessage)

    if (values.uploadedImage && values.uploadedImage.length > 0) {
      // Array.from(values.uploadedImage).forEach((file) => {
      //   formData.append("uploadedImage", file) // Append each file individually
      // })
      formData.append("uploadedImage", values.uploadedImage[0]) // If sending one file
    }

    if (values.userInputMessage.trim() === "" && values?.uploadedImage === undefined) {
      return
    }

    await sendNewMessage(formData)
    form.reset()
    setIsPictureSelected(false)
  }

  const setOnChangePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    form.setValue("uploadedImage", files || undefined)
    setIsPictureSelected(files !== null && files.length > 0)
  }

  const removePicture = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    form.setValue("uploadedImage", undefined)
    setIsPictureSelected(false)
  }

  useEffect(() => {
    if (!userInputMessage) return

    sendSocketTyping(true)

    const typingTimeout = setTimeout(() => {
      sendSocketTyping(false)
    }, 1500)

    return () => clearTimeout(typingTimeout)
  }, [userInputMessage])

  const handleTypingBlur = () => {
    sendSocketTyping(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="min-h-[10vh] flex items-center justify-center gap-2 border-t"
        encType="multipart/form-data"
      >
        <FormItem>
          <FormControl>
            <div>
              <Input
                id="uploadedImage"
                type="file"
                className="hidden"
                onChange={setOnChangePicture}
                multiple
              />
              <Label
                htmlFor="uploadedImage"
                className="cursor-pointer bg-background text-foreground p-2 rounded-full flex items-center justify-center border border-muted"
              >
                {!isPictureSelected && <Plus className="w-6 h-6 text-muted-foreground" />}
              </Label>
              {isPictureSelected && (
                <Button
                  variant="ghost"
                  onClick={removePicture}
                >
                  <Trash2 className="w-2 h-2 text-muted-foreground" />
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
        <FormField
          control={form.control}
          name="userInputMessage"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <TextareaAutosize
                  {...field}
                  placeholder="Type a message..."
                  minRows={1}
                  maxRows={3}
                  onBlur={() => {
                    field.onBlur()
                    handleTypingBlur()
                  }}
                  className={cn(
                    /**Input classes just to make it beautiful */
                    "border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                    "border w-[60vw] min-w-[30vw] px-2 mt-1 resize-none rounded-sm" /**custom classes */
                  )}

                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Send</Button>
      </form>
    </Form>
  );
}

export default MessageInput
