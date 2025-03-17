import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RootState } from "@/store/store";
import { addMessage } from "@/store/slices/messages";
import api from "@/lib/axiosInstance";

const formSchema = z.object({
  userInputMessage: z.string().trim(),
  // picture: z.instanceof(FileList).optional(),
})

function MessagesInputSection() {

  const { getToken } = useAuth()

  const { selectedChat } = useSelector((state: RootState) => state.chats)
  const userId = useSelector((state: RootState) => state.user.userId)
  const dispatch = useDispatch()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInputMessage: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

    try {
      const token = await getToken()
      const { data } = await api.post("/v1/message/create", { sender: userId, chatId: selectedChat?._id, message: values.userInputMessage, status: "sent" }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      dispatch(addMessage({ chatId: selectedChat?._id || "", message: data.data.filteredMessage }))
      form.reset()

    } catch (error) {
      console.error("Error sending message", error)
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", error.response?.data)
      }
    }
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

export default MessagesInputSection
