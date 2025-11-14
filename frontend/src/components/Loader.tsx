export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Main logo container */}
      <div className="relative z-10 mb-12">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 -m-4 animate-spin-slow">
          <svg viewBox="0 0 200 200" className="w-52 h-52">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="4 8"
              opacity="0.3"
            />
            <defs>
              <linearGradient
                id="gradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop
                  offset="0%"
                  stopColor="rgb(var(--primary))"
                  stopOpacity="1"
                />
                <stop
                  offset="100%"
                  stopColor="rgb(var(--primary))"
                  stopOpacity="0.3"
                />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Middle rotating hexagon ring */}
        <div className="absolute inset-0 -m-2 animate-spin-reverse">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            <polygon
              points="100,20 180,60 180,140 100,180 20,140 20,60"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Main hexagon with gradient and glow */}
        <div className="relative w-40 h-40 animate-float">
          {/* Glowing background */}
          <div className="absolute inset-0 blur-xl opacity-50">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <polygon
                points="100,25 170,65 170,135 100,175 30,135 30,65"
                fill="hsl(var(--primary))"
              />
            </svg>
          </div>

          {/* Main hexagon with gradient */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient
                  id="hexGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
                </linearGradient>
              </defs>
              <polygon
                points="100,25 170,65 170,135 100,175 30,135 30,65"
                fill="url(#hexGradient)"
                className="drop-shadow-2xl"
              />
            </svg>
          </div>

          {/* Chat bubble with H letter - Enhanced */}
          <div className="absolute inset-0 animate-bounce-subtle">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              {/* Chat bubble shadow */}
              <path
                d="M100,72 C125,72 140,87 140,107 C140,127 125,142 100,142 L90,142 L75,162 L75,142 C75,142 60,142 60,142 C60,142 60,107 60,107 C60,87 75,72 100,72 Z"
                fill="hsl(var(--background) / 0.1)"
                transform="translate(2, 2)"
              />
              {/* Chat bubble */}
              <path
                d="M100,70 C125,70 140,85 140,105 C140,125 125,140 100,140 L90,140 L75,160 L75,140 C75,140 60,140 60,140 C60,140 60,105 60,105 C60,85 75,70 100,70 Z"
                fill="hsl(var(--background))"
                className="drop-shadow-lg"
              />
              {/* H letter with glow */}
              <g filter="url(#glow)">
                <path
                  d="M85,85 L85,125 M85,105 L115,105 M115,85 L115,125"
                  stroke="hsl(var(--primary))"
                  strokeWidth="11"
                  strokeLinecap="round"
                  fill="none"
                />
              </g>
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
            </svg>
          </div>

          {/* Orbiting particles */}
          <div className="absolute inset-0 animate-spin-slow">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="absolute inset-0 animate-spin-reverse">
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>
      </div>

      {/* Brand text with animation */}
      <div className="relative z-10 flex flex-col items-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700">
          Chat Hive
        </h1>

        <p className="text-sm text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          Connecting conversations...
        </p>

        {/* Loading dots */}
        <div className="flex gap-2 mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div
            className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2.5 h-2.5 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  )
}
