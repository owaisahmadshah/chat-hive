const NoChatSelected = () => {
  return (<>
    {
      <div className="max-sm:hidden w-[75vw] h-[99vh] flex flex-col items-center justify-center bg-background text-foreground">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-16 h-16 text-muted-foreground mb-4"
        >
          <path d="M8 9h8M8 13h6M10 17h4" />
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        </svg>
        <p className="text-xl font-semibold text-muted-foreground">
          No Chat Selected
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Start a conversation by selecting or creating a chat.
        </p>
      </div>
    }
  </>
  )
}

export default NoChatSelected
