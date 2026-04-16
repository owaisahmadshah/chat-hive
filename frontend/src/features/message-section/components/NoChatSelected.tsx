import { MessageSquare, Zap, Globe, MousePointer2 } from "lucide-react"

export const NoChatSelected = () => {
  return (
    <div className="max-sm:hidden w-full h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md animate-in fade-in zoom-in-95 duration-1000">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="text-center space-y-2 px-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
            Chat Hive
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Connect with your friends across the globe in real-time.
            <br />
            Select a conversation from the sidebar to start messaging.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-medium text-muted-foreground">
              Instant Delivery
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50">
            <Globe className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-medium text-muted-foreground">
              Always Synced
            </span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 flex items-center gap-2 text-muted-foreground/40 animate-bounce-subtle">
        <MousePointer2 className="w-3 h-3" />
        <span className="text-xs font-medium uppercase tracking-[0.2em]">
          Select a chat to begin
        </span>
      </div>
    </div>
  )
}
