import { useState, type ReactNode } from "react";
import {
  initialState,
  UserContext,
  type UserContextStateType,
} from "./user-context";
import type { User } from "shared";

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserContextStateType>(initialState);

  const setUser = (newUser: User) => {
    setUserState({ user: newUser, isPending: false, isAuthenticated: true });
  };

  const clearUser = () => {
    setUserState({ ...initialState, isPending: false, isAuthenticated: false });
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}
