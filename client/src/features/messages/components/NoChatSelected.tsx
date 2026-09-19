import { MessageSquare } from "lucide-react";

export const NoChatSelected = () => {
  return (
    <div className="max-sm:hidden w-full h-full flex flex-col items-center justify-center bg-background/50">
      <div className="flex flex-col items-center text-center select-none animate-in fade-in duration-500 zoom-in-[0.98]">
        <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mb-5 border border-border/40 shadow-sm">
          <MessageSquare
            className="w-7 h-7 text-muted-foreground/70"
            strokeWidth={1.5}
          />
        </div>

        <div className="space-y-1.5 px-6">
          <h2 className="text-lg font-medium tracking-tight text-foreground">
            Chat Hive
          </h2>
          <p className="text-[13px] text-muted-foreground max-w-[260px] leading-relaxed">
            Select a conversation from the sidebar or start a new chat to begin
            messaging.
          </p>
        </div>
      </div>
    </div>
  );
};
