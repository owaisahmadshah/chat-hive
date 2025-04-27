import { Navigate, RouteProps } from 'react-router-dom'
import useCustomAuth from '@/hooks/useCustomAuth'

type PrivateRouteProps = RouteProps & {
  url: string
  redirectTo: string
  children: React.ReactNode
}

const PrivateRoute = ({ url, redirectTo, children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useCustomAuth();

  if (isLoading) {
    return
  }

  if (!isAuthenticated && url === "/") {
    return <Navigate to={redirectTo} replace />
  }

  if (isAuthenticated && (url === "/sign-in" || url === "sign-up")) {
    return <Navigate to={redirectTo} replace />
  }

  return <>{children}</>
}

export default PrivateRoute