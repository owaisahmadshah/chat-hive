import { useChatActions } from "@/hooks/useChatActions";
import { useEffect, useState } from "react";

export const useChatUserOnlineStatus = (userId: string | undefined | null) => {
  const [onlineStatus, setOnlineStatus] = useState<"online" | "offline">(
    "offline",
  );

  const { checkUserPresence } = useChatActions();

  const handleOnlineStatus = async () => {
    if (!userId || document.visibilityState !== "visible") return;

    try {
      const response = (await checkUserPresence(userId)) as unknown as {
        userId: string;
        status: "offline" | "online";
      };

      if (response.userId === userId && response.status === "online") {
        setOnlineStatus("online");
      } else {
        setOnlineStatus("offline");
      }
    } catch (error) {
      console.info("Unable to get user presence status");
      console.error(error);
      setOnlineStatus("offline");
    }
  };

  useEffect(() => {
    if (!userId || document.visibilityState !== "visible") return;

    const onlineStatusInterval = setInterval(handleOnlineStatus, 10000);

    return () => clearInterval(onlineStatusInterval);
  }, [userId]);

  return {
    onlineStatus,
  };
};
