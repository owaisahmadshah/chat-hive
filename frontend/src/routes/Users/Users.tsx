import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { ConnectionsList } from "./components/ConnectionList"
import { useFetchInfiniteRecommendedUsers } from "./hooks/useFetchInfiniteRecommendedUsers"

export const Users = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="h-[100dvh] w-[100dvw] text-center">
          Error occured while rendering connections
        </div>
      }
    >
      <Suspense
        fallback={
          <div className="h-[100dvh] w-[100dvw] text-center">
            Loading Users...
          </div>
        }
      >
        <ConnectionsList
          dataKey="users"
          description="Discover people you may want to connect with"
          useInfiniteQuery={useFetchInfiniteRecommendedUsers}
          link={{ text: "Connections", url: "connections" }}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
