import { createServer } from "http"
import { Server, Socket } from "socket.io"

import { app } from "../app.js"
import logger from "../utils/logger.js"
import {
  NEW_MESSAGE,
  NEW_CHAT,
  DELETE_MESSAGE,
  DELETE_CHAT,
  TYPING,
  JOIN_CHAT,
  USER_CONNECTED,
  USER_DISCONNECTED,
} from "../utils/constants.js"

interface User {
  userId: string
  socketId: string
  activeChat: string | null
}

interface Message {
  chatId: string
  content: string
  sender: string
  timestamp: Date
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
    socket.on(
      NEW_CHAT,
      (data: { chatId: string; participants: string[]; sender: string }) => {
        const { chatId, participants, sender } = data

        // Create new chat room and add all participants
        this.chatRooms.set(chatId, new Set(participants))

        // Notify all participants except the creator
        participants.forEach((participantId) => {
          if (participantId !== sender) {
            const participant = this.activeUsers.get(participantId)
            if (participant) {
              this.io.to(participant.socketId).emit(NEW_CHAT, {
                chatId,
                participants,
                sender,
              })
            }
          }
        })

        // Handle chat deletion
        socket.on(
          DELETE_CHAT,
          (data: { chatId: string; participants: string[] }) => {
            const { chatId, participants } = data

            // Remove chat from our tracking
            this.chatRooms.delete(chatId)

            participants.forEach((participantId) => {
              const participant = this.activeUsers.get(participantId)
              if (participant && participant.socketId !== socket.id) {
                this.io.to(participant.socketId).emit(DELETE_CHAT, { chatId })
              }
            })
          }
        )
      }
    )
  }

  /**
   * Handles message-related events (new messages, typing indicators, message deletion)
   */
  private setupMessageHandlers(socket: Socket) {
    // Handle new message event
    socket.on(
      NEW_MESSAGE,
      (data: { chatId: string; content: string; sender: string }) => {
        const { chatId, content, sender } = data

        const message: Message = {
          chatId,
          content,
          sender,
          timestamp: new Date(),
        }

        // Broadcast message to everyone in the chat room except sender
        socket.to(chatId).emit(NEW_MESSAGE, message)
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

    // Handle message deletion
    socket.on(
      DELETE_MESSAGE,
      (data: { chatId: string; messageId: string; sender: string }) => {
        // Notify everyone in the chat that a message was deleted
        socket.to(data.chatId).emit(DELETE_MESSAGE, {
          messageId: data.messageId,
          deletedBy: data.sender,
          timestamp: new Date(),
        })
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
