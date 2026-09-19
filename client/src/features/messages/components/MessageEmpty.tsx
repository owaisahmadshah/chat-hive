import { MessageSquarePlus } from "lucide-react";

const MessageEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center select-none animate-in fade-in duration-500">
      <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center mb-4 border border-border/40 shadow-sm">
        <MessageSquarePlus
          className="w-6 h-6 text-muted-foreground/70"
          strokeWidth={1.5}
        />
      </div>

      <h3 className="text-sm font-medium tracking-tight text-foreground mb-1">
        Say hello!
      </h3>
      <p className="text-[13px] text-muted-foreground max-w-[220px] leading-relaxed">
        This is the beginning of your chat history with this user.
      </p>
    </div>
  );
};

export default MessageEmpty;
