import { MessageSquare, Sparkles } from "lucide-react"

const NoChats = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
        No Chats Yet
        <Sparkles className="w-5 h-5 text-primary" />
      </h2>

      <p className="text-sm text-muted-foreground max-w-[300px] mb-6">
        Your conversations will appear here. Start connecting with friends and
        colleagues!
      </p>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Click "New Chat" to get started</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Search for users by username</span>
        </div>
      </div>
    </div>
  )
}

export default NoChats
