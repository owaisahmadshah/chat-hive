import { Skeleton } from "@/components/ui/skeleton";

export function ChatListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="cursor-pointer px-5 pt-5 bg-red flex justify-center hover:bg-secondary">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[15vw]" />
            <Skeleton className="h-4 w-[15vw]" />
          </div>
        </div>
      ))}
    </div>
  );
}
