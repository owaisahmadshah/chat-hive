import { Navigate, type RouteProps } from "react-router-dom";
import { useUser } from "../context/user-context";
import { SessionLoader } from "@/components/SessionLoader";

type PrivateRouteProps = RouteProps & {
  url: string;
  redirectTo: string;
  children: React.ReactNode;
};

const PrivateRoute = ({ url, redirectTo, children }: PrivateRouteProps) => {
  const { state } = useUser();

  const { isAuthenticated, isPending } = state;

  if (isPending) {
    return <SessionLoader />;
  }

  if (!isAuthenticated && url === "/") {
    return <Navigate to={redirectTo} replace />;
  }

  if (
    isAuthenticated &&
    (url === "/sign-in" || url === "/sign-up" || url === "/forgot-password")
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
