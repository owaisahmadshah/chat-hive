import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

import { useFetchInfiniteConnection } from "./hooks/useFetchInfiniteConnection"
import { ConnectionsList } from "./components/ConnectionList"

export const Connections = () => {
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
            Loading Connections...
          </div>
        }
      >
        <ConnectionsList
          useInfiniteQuery={useFetchInfiniteConnection}
          dataKey="connections"
          description="People you are connected with"
          link={{ text: "Users", url: "users" }}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
