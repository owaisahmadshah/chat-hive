import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  userInputMessage: z.string().trim(),
  // picture: z.instanceof(FileList).optional(),
});

function MessagesInputSection() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userInputMessage: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // const formData = new FormData();
    // formData.append("userInputMessage", values.userInputMessage);
    // if (values.picture && values.picture.length > 0) {
    //   formData.append("picture", values.picture[0]);
    // }
    // console.log("Form Data:", Object.fromEntries(formData.entries()));
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="h-[10vh] flex items-center justify-center gap-2 border-t">
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
                <Input placeholder="Message..." {...field} className="min-w-[60vw]" />
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

export default MessagesInputSection;
