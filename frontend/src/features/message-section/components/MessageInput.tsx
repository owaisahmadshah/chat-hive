import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { messageSchema } from "../types/message-schema";
import { useMessage } from "../hooks/useMessage";

function MessageInput() {

  const { sendNewMessage } = useMessage()

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      userInputMessage: "",
    },
  })

  async function onSubmit(values: z.infer<typeof messageSchema>) {
    // TODO Handle picture upload
    // const formData = new FormData();
    // formData.append("userInputMessage", values.userInputMessage);
    // if (values.picture && values.picture.length > 0) {
    //   formData.append("picture", values.picture[0]);
    // }
    // console.log("Form Data:", Object.fromEntries(formData.entries()));
    if (values.userInputMessage.trim() === "") {
      return
    }
    await sendNewMessage(values)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="h-[10vh] flex items-center justify-center gap-2 border-t"
      >
        {/* <FormItem>
          <FormControl>
            <Input
              id="picture"
              type="file"
              //@ts-ignore
              onChange={(e) => form.setValue("picture", e.target.files)}
            />
          </FormControl>
          <FormMessage />
        </FormItem> */}
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
