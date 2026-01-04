import { Button } from "@/components/ui/button"
import { ConnectionCard } from "./components/ConnectionCard"
import { useFetchInfiniteConnection } from "./hooks/useFetchInfiniteConnection"
import { useDeleteConnection } from "./hooks/useDeleteConnection"

export const Connections = () => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useFetchInfiniteConnection()

  const { mutateAsync: removeConnection } = useDeleteConnection()

  const connections = data.pages.flatMap((page) => page.connections)

  return (
    <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-4 space-y-2 py-4">
      <h1 className="w-full text-center text-2xl font-bold">
        Your Connections
      </h1>
      {connections.map((connection) => (
        <ConnectionCard
          key={connection._id}
          user={{
            _id: connection.receiver._id,
            imageUrl: connection.receiver.imageUrl,
            username: connection.receiver.username,
          }}
          isConnection={true}
          removeConnection={() =>
            removeConnection({ connectionId: connection._id })
          }
        />
      ))}
      <div>
        {hasNextPage && (
          <div className="px-4 py-2">
            <Button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              variant="link"
            >
              {isFetchingNextPage
                ? "Loading more connections..."
                : "Load more connections"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
