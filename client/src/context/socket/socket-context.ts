import * as React from "react";
import { Socket } from "socket.io-client";

interface SocketContextType {
  globalSocket: Socket | null;
  chatSocket: Socket | null;
  isConnected: boolean;
}

export const SocketContext = React.createContext<SocketContextType | null>(
  null,
);

export function useSockets() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSockets must be deployed within a matching <SocketProvider />",
    );
  }
  return context;
}
