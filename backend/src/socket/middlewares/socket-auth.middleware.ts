import { Socket } from "socket.io"
import jwt from "jsonwebtoken"

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: Error) => void
): void {
  const token = socket.handshake.auth?.token

  if (!token) {
    return next(new Error("Authentication error: No token provided"))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
    }
    socket.data.userId = decoded.userId
    next()
  } catch (err) {
    next(new Error("Authentication error: Invalid token"))
  }
}
