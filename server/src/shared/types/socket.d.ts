declare module 'socket.io' {
  interface Socket {
    user?: {
      sub: string;
    };
  }
}

export {};
