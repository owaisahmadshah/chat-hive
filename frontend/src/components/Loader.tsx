export default function Loader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="relative w-40 h-40 mb-8">
        {/* Animated hexagon background */}
        <div className="absolute inset-0 animate-pulse">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <polygon
              points="100,25 170,65 170,135 100,175 30,135 30,65"
              fill="#FF9500"
              strokeWidth="0"
            />
          </svg>
        </div>

        {/* Chat bubble with H letter */}
        <div className="absolute inset-0 animate-bounce-slow">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M100,70 C125,70 140,85 140,105 C140,125 125,140 100,140 L90,140 L75,160 L75,140 C75,140 60,140 60,140 C60,140 60,105 60,105 C60,85 75,70 100,70 Z"
              className="fill-background"
            />
            <path
              d="M85,85 L85,125 M85,105 L115,105 M115,85 L115,125"
              stroke="#FF9500"
              strokeWidth="12"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>

        {/* Surrounding hexagons that fade in */}
        <div className="absolute inset-0 animate-fade-in">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <g className="opacity-20">
              <polygon
                points="30,65 60,45 60,85"
                fill="#FF9500"
              />
              <polygon
                points="170,65 140,45 140,85"
                fill="#FF9500"
              />
              <polygon
                points="100,25 130,45 70,45"
                fill="#FF9500"
              />
              <polygon
                points="100,175 130,155 70,155"
                fill="#FF9500"
              />
              <polygon
                points="30,135 60,155 60,115"
                fill="#FF9500"
              />
              <polygon
                points="170,135 140,155 140,115"
                fill="#FF9500"
              />
            </g>
          </svg>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Chat-Hive
        </h1>
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ animationDelay: '0ms', backgroundColor: '#FF9500' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ animationDelay: '200ms', backgroundColor: '#FF9500' }}></div>
          <div className="w-3 h-3 rounded-full animate-bounce" style={{ animationDelay: '400ms', backgroundColor: '#FF9500' }}></div>
        </div>
      </div>
    </div>
  );
}