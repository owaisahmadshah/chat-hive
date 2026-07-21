import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_WS_URL;

type SocketSnapshot = {
  globalSocket: Socket | null;
  chatSocket: Socket | null;
  isConnected: boolean;
};

class SocketManager {
  private globalSocket: Socket | null = null;
  private chatSocket: Socket | null = null;
  private connected = false;
  private listeners = new Set<() => void>();
  private snapshot: SocketSnapshot = {
    globalSocket: null,
    chatSocket: null,
    isConnected: false,
  };

  private emit() {
    this.snapshot = {
      globalSocket: this.globalSocket,
      chatSocket: this.chatSocket,
      isConnected: this.connected,
    };
    this.listeners.forEach((l) => l());
  }

  public subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  public getSnapshot = () => this.snapshot;

  public connect(userId: string) {
    if (
      this.globalSocket?.connected &&
      this.globalSocket.io.opts.extraHeaders?.["user-id"] === userId
    ) {
      return;
    }
    this.disconnect();

    const connectionOptions = {
      autoConnect: true,
      withCredentials: true,
      extraHeaders: { "user-id": userId },
    };

    this.globalSocket = io(SOCKET_URL, connectionOptions);
    this.chatSocket = io(`${SOCKET_URL}/chat`, connectionOptions);

    this.globalSocket.on("connect", () => {
      this.connected = true;
      this.emit();
    });
    this.globalSocket.on("disconnect", () => {
      this.connected = false;
      this.emit();
    });

    this.emit(); // notify with the new socket instances immediately
  }

  public disconnect() {
    this.globalSocket?.removeAllListeners();
    this.globalSocket?.disconnect();
    this.globalSocket = null;

    this.chatSocket?.removeAllListeners();
    this.chatSocket?.disconnect();
    this.chatSocket = null;

    this.connected = false;
    this.emit();
  }
}

export const socketManager = new SocketManager();
