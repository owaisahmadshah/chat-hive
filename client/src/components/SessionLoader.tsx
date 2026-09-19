import { MessageSquare, Loader2 } from "lucide-react";

export function SessionLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background select-none">
      <div className="flex flex-col items-center animate-in fade-in zoom-in-[0.98] duration-700">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-sm mb-6 border border-primary/10">
          <MessageSquare
            className="w-7 h-7 text-primary-foreground ml-0.5"
            strokeWidth={2}
          />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h1 className="text-xl font-medium tracking-tight text-foreground">
            Chat Hive
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[13px] font-medium tracking-wide uppercase">
              Authenticating
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
