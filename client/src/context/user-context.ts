import { createContext, useContext } from "react";
import { type User } from "shared";

export interface UserContextStateType {
  user: User | null;
  isPending: boolean;
  isAuthenticated: boolean;
}

export interface UserContextType {
  state: UserContextStateType;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const initialState: UserContextStateType = {
  user: null,
  isPending: true,
  isAuthenticated: false,
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
