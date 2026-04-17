import { MessageSquarePlus, Sparkles } from "lucide-react"

const MessageEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-1000">
      <div className="flex flex-col items-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4 border border-primary/10">
          <MessageSquarePlus className="w-8 h-8 text-primary/40" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground/80">
            Say hello!
          </h3>
          <p className="text-sm text-muted-foreground/60 max-w-[240px]">
            This is the beginning of your chat history with this user.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/50 border border-border/40">
        <Sparkles className="w-3 h-3 text-primary/60" />
        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em]">
          New Conversation
        </span>
      </div>
    </div>
  )
}

export default MessageEmpty