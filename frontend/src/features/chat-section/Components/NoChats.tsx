import { MessageSquare } from "lucide-react";

const NoChats = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
      <MessageSquare className="w-16 h-16 bg-" />
      <h2 className="mt-4 text-xl font-semibold">No Chats Yet</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Start a conversation and your chats will appear here.
      </p>
    </div>
  );
}
export default NoChats