import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

export function useSocketEvent<T = any>(
  socket: Socket | null,
  eventName: string,
  handler: (data: T) => void,
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const eventListener = (data: T) => handlerRef.current(data);

    socket.on(eventName, eventListener);

    return () => {
      socket.off(eventName, eventListener);
    };
  }, [socket, eventName]);
}
