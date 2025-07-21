import { Navigate, RouteProps } from "react-router-dom"
import useRequireAuth from "@/hooks/useRequireAuth"

type PrivateRouteProps = RouteProps & {
  url: string
  redirectTo: string
  children: React.ReactNode
}

const PrivateRoute = ({ url, redirectTo, children }: PrivateRouteProps) => {
  const { isSignedIn, isLoading } = useRequireAuth()

  if (isLoading) {
    return
  }

  if (!isSignedIn && url === "/") {
    return <Navigate to={redirectTo} replace />
  }

  if (isSignedIn && (url === "/sign-in" || url === "/sign-up")) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default PrivateRoute
