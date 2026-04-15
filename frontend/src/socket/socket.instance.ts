import { io, Socket } from "socket.io-client"

let socket: Socket | null = null

export const getSocket = (): Socket | null => socket

export const createSocket = (): Socket => {
  if (!socket) {
    socket = io(import.meta.env.VITE_REACT_APP_SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    })
  }
  return socket
}

export const destroySocket = (): void => {
  socket?.disconnect()
  socket = null
}
