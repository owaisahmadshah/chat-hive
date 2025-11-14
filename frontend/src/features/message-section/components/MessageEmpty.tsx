import { Send, Sparkles } from "lucide-react"

const MessageEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Send className="w-10 h-10 text-primary" />
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        No Messages Yet
        <Sparkles className="w-4 h-4 text-primary" />
      </h3>

      <p className="text-sm text-muted-foreground max-w-[280px]">
        Start the conversation! Send your first message below.
      </p>
    </div>
  )
}

export default MessageEmpty
