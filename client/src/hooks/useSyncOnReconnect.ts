import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useSyncOnReconnect = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleReconnect = () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["messages"] });

      console.info("Network reconnected: Queries invalidated for sync.");
    };

    window.addEventListener("online", handleReconnect);

    return () => {
      window.removeEventListener("online", handleReconnect);
    };
  }, [queryClient]);
};
