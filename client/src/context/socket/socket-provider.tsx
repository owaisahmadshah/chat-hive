import * as React from "react";
import { useUser } from "../user-context";
import { socketManager } from "./socket-manager";
import { SocketContext } from "./socket-context";

export function SocketContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { state } = useUser();
  const { user } = state;

  React.useEffect(() => {
    if (!user?.id) {
      socketManager.disconnect();
      return;
    }
    socketManager.connect(user.id);
  }, [user?.id]);

  const snapshot = React.useSyncExternalStore(
    socketManager.subscribe,
    socketManager.getSnapshot,
  );

  return (
    <SocketContext.Provider value={snapshot}>{children}</SocketContext.Provider>
  );
}
