import { createServer } from "http"
import { Server, Socket } from "socket.io"

import { app } from "../app.js"
import logger from "../utils/logger.js"
import {
  NEW_MESSAGE,
  NEW_CHAT,
  TYPING,
  JOIN_CHAT,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from "../utils/constants.js"
import type { Chat } from "../types/chat.socket.interface.js"
import type { Message } from "../types/message.socket.interface.js"

interface User {
  userId: string
  socketId: string
  activeChat: string | null
}

/**
 * Manages all real-time socket connections and chat functionality
 * This class handles user connections, chat rooms, and message broadcasting
 */
class SocketManager {
  private io: Server // Socket.io server instance

  // activeUsers: A map that keeps track of currently online users.
  // Key: userId, Value: { userId, socketId, activeChat }.
  // Helps in quick lookup of a user’s connection and active chat.
  private activeUsers: Map<string, User>

  // chatRooms: A map that tracks which users are in which chat.
  // Key: chatId, Value: Set of userIds.
  // Used to manage chat participants and broadcast messages efficiently.
  private chatRooms: Map<string, Set<string>>

  constructor(server: Server) {
    this.io = server
    this.activeUsers = new Map() // Stores online users and their socket information
    this.chatRooms = new Map() // Tracks which users are in which chat rooms
    this.initialize()
  }

  /**
   * Sets up the main socket.io connection handler
   */
  private initialize() {
    this.io.on("connection", (socket: Socket) => {
      logger.info(`New connection: ${socket.id}`)
      this.setupUserHandlers(socket)
      this.setupChatHandlers(socket)
      this.setupMessageHandlers(socket)
      this.setupDisconnectHandler(socket)
    })
  }

  /**
   * Handles user connection events
   * When a user connects, they're added to the activeUsers map
   */
  private setupUserHandlers(socket: Socket) {
    socket.on(USER_CONNECTED, (userId: string) => {
      const user: User = {
        userId,
        socketId: socket.id,
        activeChat: null,
      }

      // Store user in the activeUsers map for quick lookup
      this.activeUsers.set(userId, user)
      socket.data.userId = userId // Store userId in socket for reference

      logger.info(`User ${userId} connected with socket ${socket.id}`)
    })
  }

  /**
   * Handles chat room related events (joining, creating, deleting)
   * Socket.io rooms are used to group connections for targeted message broadcasting
   */
  private setupChatHandlers(socket: Socket) {
    // Handle user joining a chat
    socket.on(JOIN_CHAT, (chatId: string) => {
      const userId = socket.data.userId

      // Join socket.io room - this allows broadcasting to all users in this chat
      socket.join(chatId)

      // Update user's active chat status
      const user = this.activeUsers.get(userId)
      if (user) {
        user.activeChat = chatId
      }

      // Track chat participants in our custom chatRooms map
      if (!this.chatRooms.has(chatId)) {
        this.chatRooms.set(chatId, new Set())
      }
      this.chatRooms.get(chatId)?.add(userId)

      logger.info(`User ${userId} joined chat: ${chatId}`)
    })

    // Handle creation of a new chat
    socket.on(NEW_CHAT, (data: { chat: Chat }) => {
      const { chat } = data

      const participants = chat.users.map((user) => user._id)
      const sender = chat.admin._id
      const chatId = chat._id

      // Create new chat room and add all participants
      this.chatRooms.set(chatId, new Set(participants))

      // Notify all participants except the creator
      participants.forEach((participantId) => {
        if (participantId !== sender) {
          const participant = this.activeUsers.get(participantId)
          if (participant) {
            this.io.to(participant.socketId).emit(NEW_CHAT, { chat })
          }
        }
      })
    })
  }

  /**
   * Handles message-related events (new messages, typing indicators, message deletion)
   */
  private setupMessageHandlers(socket: Socket) {
    // Handle new message event
    socket.on(
      NEW_MESSAGE,
      // (data: { chatId: string; content: string; sender: string }) => {
      (
        data: { chatId: string; message: Message; messageUsers: string[] },
        callback
      ) => {
        const { chatId, message, messageUsers } = data

        // Broadcast message to everyone in the chat room except sender
        socket
          .to(chatId)
          .timeout(1000)
          .emit(NEW_MESSAGE, { message }, (err: any, res: any) => {
            // TODO: Check and correct condition & add types for err, res
            if (res.length === 0 || err?.length > 0) {
              // Handle offline users or users not in the chat of socket.io rooms
              messageUsers.forEach((messageUserId) => {
                if (messageUserId !== message.sender._id) {
                  const messageUser = this.activeUsers.get(messageUserId)
                  if (messageUser) {
                    this.io
                      .to(messageUser.socketId)
                      .timeout(3000)
                      .emit(
                        NEW_MESSAGE,
                        { message },
                        (nestedErr: any, nestedRes: any) => {
                          // If you want to confirm user get or not you can get here,
                          // just push callback nestedRes, nestedErr to array and send
                        }
                      )
                  }
                }
              })
              callback({
                receiverResponse: err,
                status: false,
                message: "Unable to send message",
              })
            } else {
              callback({
                receiverResponse: res,
                status: true,
                message: "Sucessfully send message",
              })
            }
          })
      }
    )

    // Handle typing indicator events
    socket.on(
      TYPING,
      (data: { chatId: string; userId: string; isTyping: boolean }) => {
        // Broadcast typing status to everyone in the chat except the typer
        socket.to(data.chatId).emit(TYPING, data)
      }
    )
  }

  /**
   * Handles user disconnection events
   * Cleans up user data and notifies other users
   */
  private setupDisconnectHandler(socket: Socket) {
    socket.on("disconnect", () => {
      const userId = socket.data.userId

      if (userId) {
        // Remove user from active users tracking
        this.activeUsers.delete(userId)

        // Remove user from all chat rooms they were part of
        this.chatRooms.forEach((participants, chatId) => {
          if (participants.has(userId)) {
            participants.delete(userId)
          }
        })

        // Broadcast to all connected clients that this user disconnected
        socket.broadcast.emit(USER_DISCONNECTED, userId)

        logger.info(`User ${userId} disconnected`)
      }
    })
  }
}

// Create and export server
const socketHttpServer = createServer(app)
const io = new Server(socketHttpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Initialize socket manager with the server
new SocketManager(io)

export { socketHttpServer }
