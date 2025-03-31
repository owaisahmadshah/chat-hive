import { Skeleton } from "@/components/ui/skeleton"

const MessageSectionSkeleton = () => {
  return (
    <section className="min-w-[75vw]">
      <div className="w-[100%] h-[15vh] flex gap-5 items-center p-5 bg-background border-b border-r">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[15vw]" />
          <Skeleton className="h-4 w-[10vw]" />
        </div>
      </div>
      <div className="h-[75vh] pb-3 space-y-4 p-5">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-[50vw] rounded-lg" />
          </div>
        ))}
      </div>
      <div className="h-[10vh] flex items-center justify-center gap-2 border-t p-5">
        <Skeleton className="h-10 w-[60vw] rounded-lg" />
        <Skeleton className="h-10 w-16 rounded-lg" />
      </div>
    </section>
  )
}

export default MessageSectionSkeleton