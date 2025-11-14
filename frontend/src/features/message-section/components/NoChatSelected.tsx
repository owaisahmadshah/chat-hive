import { MessageSquare, ArrowLeft, Sparkles } from "lucide-react"

const NoChatSelected = () => {
  return (
    <div className="max-sm:hidden w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/5 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Icon with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center backdrop-blur-sm border border-primary/10">
            <MessageSquare className="w-12 h-12 text-primary" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold flex items-center gap-2 justify-center">
            Welcome to Chat Hive
            <Sparkles className="w-6 h-6 text-primary" />
          </h2>
          <p className="text-muted-foreground max-w-[400px]">
            Select a conversation from the sidebar to start chatting, or create
            a new chat to connect with someone.
          </p>
        </div>

        {/* Helpful tips */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-primary" />
            </div>
            <span>Choose a chat from the left panel</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary" />
            </div>
            <span>Or start a new conversation</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoChatSelected
