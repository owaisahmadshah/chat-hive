import { Button } from "@/components/ui/button"
import { ConnectionCard } from "./ConnectionCard"
import { useDeleteConnection } from "../hooks/useDeleteConnection"
import { useCreateConnection } from "../hooks/useCreateConnection"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

type ConnectionMode = "users" | "connections"

interface IConnectionListProps {
  useInfiniteQuery: () => {
    data: any
    error: any
    hasNextPage: boolean
    fetchNextPage: () => void
    isFetchingNextPage: boolean
    isLoading: boolean
  }
  description: string
  dataKey: ConnectionMode
  link: {
    url: ConnectionMode
    text: string
  }
}

export const ConnectionsList = ({
  useInfiniteQuery,
  description,
  dataKey,
  link,
}: IConnectionListProps) => {
  const { data, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery()

  const { mutateAsync: removeConnection } = useDeleteConnection()
  const { mutateAsync: addConnection } = useCreateConnection()

  const connections = data?.pages?.flatMap((page) => page[dataKey]) ?? []

  const normalizeUser = (item: any) => {
    if (dataKey === "users") {
      return {
        _id: item._id,
        username: item.username,
        imageUrl: item.imageUrl,
      }
    }

    return {
      _id: item.receiver._id,
      username: item.receiver.username,
      imageUrl: item.receiver.imageUrl,
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      {/* Simple Navigation */}
      <nav className="w-full border-b bg-card rounded-xl">
        <ul className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-3 text-sm font-medium text-muted-foreground">
          <li>
            <Link to="/" className="transition-colors hover:text-foreground">
              Conversations
            </Link>
          </li>

          <li className="text-muted-foreground">/</li>

          <li>
            <Link
              to={`/${link.url}`}
              className="text-foreground transition-colors hover:underline"
            >
              {link.text}
            </Link>
          </li>
        </ul>
      </nav>

      <p className="mt-1 block text-sm text-muted-foreground p-6">
        {description}
      </p>

      {/* Connections Grid */}
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-4",
          dataKey === "connections" && "gap-2"
        )}
      >
        {connections.map((item) => {
          const user = normalizeUser(item)

          return (
            <ConnectionCard
              key={item._id}
              user={user}
              mode={dataKey === "users" ? "user" : "connection"}
              onAdd={
                dataKey === "users"
                  ? () => addConnection({ receiverId: user._id })
                  : undefined
              }
              onRemove={
                dataKey === "connections"
                  ? () =>
                      removeConnection({
                        connectionId: item._id,
                      })
                  : undefined
              }
            />
          )
        })}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={fetchNextPage}
            disabled={isFetchingNextPage}
            variant="link"
            className="text-blue-600 hover:text-blue-700"
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        </div>
      )}
    </div>
  )
}
