import { MessageSquare } from "lucide-react";

export function SessionLoader() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative flex items-center justify-center w-28 h-28 mb-8">
          <div className="absolute inset-0 rounded-3xl border border-primary/20 animate-[spin_8s_linear_infinite]" />
          <div className="absolute inset-2 rounded-2xl border border-primary/40 border-t-transparent animate-[spin_3s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-xl bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent backdrop-blur-md" />

          <div className="relative p-4 bg-primary text-primary-foreground rounded-2xl shadow-2xl shadow-primary/40 border border-primary-foreground/20">
            <MessageSquare className="w-8 h-8" />
          </div>
        </div>

        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
            Chat Hive
          </h1>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Authenticating
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_100ms]" />
              <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_200ms]" />
              <span className="w-1 h-1 bg-primary rounded-full animate-[bounce_1s_infinite_300ms]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
