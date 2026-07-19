import { useMemo, type ReactNode } from "react";
import { UserContext } from "./user-context";
import type { User } from "shared";
import { useQueryClient } from "@tanstack/react-query";
import { useGetUser } from "@/hooks/useGetUser";

export function UserProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useGetUser();

  const user = data || null;

  const setUser = (newUser: User) => {
    queryClient.setQueryData(["user"], newUser);
  };

  const clearUser = () => {
    queryClient.setQueryData(["user"], null);
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  const contextValue = useMemo(
    () => ({
      state: {
        user,
        isPending,
        isAuthenticated: !!user && !isError,
      },
      setUser,
      clearUser,
    }),
    [user, isPending, isError],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
