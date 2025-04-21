const MessageEmpty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-foreground">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-12 h-12 text-muted-foreground mb-2"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-2.4.33A8.5 8.5 0 1 1 9.5 3a8.38 8.38 0 0 1 .33 2.4M3 21l5.5-5.5" />
      </svg>
      <p className="text-lg font-medium text-muted-foreground">
        You don’t have any messages...
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Start a conversation now!
      </p>
    </div>
  )
}

export default MessageEmpty
