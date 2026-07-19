import { createContext, useContext } from "react";
import { type User } from "shared";

export interface UserContextStateType {
  user: User | null;
  isPending: boolean;
  isAuthenticated: boolean;
}

export interface UserContextType {
  user: UserContextStateType;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const initialState: UserContextStateType = {
  user: null,
  isPending: false, // TODO: Must change to true after adding useGetUser hook
  isAuthenticated: false,
};

// 1. Export only the context and types here
export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);

// 2. Export the hook here
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
