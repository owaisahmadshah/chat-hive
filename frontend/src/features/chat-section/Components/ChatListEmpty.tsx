import { Users, Plus } from "lucide-react"

export const ChatListEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Users className="w-8 h-8 text-muted-foreground/30" />
      </div>
      <h3 className="text-sm font-semibold text-foreground/80 mb-1">
        No conversations yet
      </h3>
      <p className="text-xs text-muted-foreground/60 leading-relaxed mb-6">
        Start a new chat to begin messaging your friends and colleagues.
      </p>

      <div className="flex items-center gap-2 text-primary animate-bounce-subtle">
        <span className="text-xs font-medium">Click plus to start</span>
        <Plus className="w-4 h-4" />
      </div>
    </div>
  )
}
