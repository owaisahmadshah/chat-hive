import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

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

function MessageInput() {

  const [isPictureSelected, setIsPictureSelected] = useState<boolean>(false)

  const { sendNewMessage } = useMessage()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      userInputMessage: "",
      uploadedImage: undefined
    },
  })

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    const formData = new FormData()
    formData.append("message", values.userInputMessage)


    if (values.uploadedImage && values.uploadedImage.length > 0) {
      formData.append("uploadedImage", values.uploadedImage[0])
    }

    if (values.userInputMessage.trim() === "" && values?.uploadedImage === undefined) {
      return
    }

    await sendNewMessage(formData)
    form.reset()
    form.setValue("uploadedImage", undefined)
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="h-[10vh] flex items-center justify-center gap-2 border-t"
      >
        <FormItem>
          <FormControl>
            <div>
              <Input
                id="uploadedImage"
                type="file"
                className="hidden"
                onChange={setOnChangePicture}
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
                <Input placeholder="Type a message" {...field} className="min-w-[60vw]" />
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
