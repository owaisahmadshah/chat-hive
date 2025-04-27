import { createServer } from "http"
import { Server, Socket } from "socket.io"

import { app } from "../app.js"
import logger from "../utils/logger.js"
import {
  NEW_MESSAGE,
  TYPING,
  JOIN_CHAT,
  USER_CONNECTED,
  USER_DISCONNECTED,
  USER_OFFLINE,
  USER_ONLINE,
  USER_ONLINE_STATUS,
  SEEN_AND_RECEIVE_MESSAGE,
  SEEN_AND_RECEIVE_MESSAGES,
} from "shared"
import type { Message } from "../types/message.socket.interface.js"
import { User } from "../models/user.model.js"

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

  // onlineUsers: A map that tracks all online users
  // key: userId, Value: boolean
  private onlineUsers: Map<string, boolean>

  constructor(server: Server) {
    this.io = server
    this.activeUsers = new Map() // Stores online users and their socket information
    this.chatRooms = new Map() // Tracks which users are in which chat rooms
    this.onlineUsers = new Map() // Tracks online status only
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
    const handleUserConnected = (userId: string) => {
      const user: User = {
        userId,
        socketId: socket.id,
        activeChat: null,
      }

      // Store user in the activeUsers map for quick lookup
      this.activeUsers.set(userId, user)
      socket.data.userId = userId // Store userId in socket for reference

      logger.info(`User ${userId} connected with socket ${socket.id}`)
    }

    const handleUserOnline = (userId: string) => {
      this.onlineUsers.set(userId, true)

      User.findByIdAndUpdate(
        userId,
        { updateAt: new Date() },
        { new: true }
      ).catch((err) =>
        logger.error(
          "Error updating user lastSeen in socket handleUserOnline",
          err
        )
      )
    }

    const handleUserOffline = (userId: string) => {
      this.onlineUsers.delete(userId)

      User.findByIdAndUpdate(
        userId,
        { updateAt: new Date() },
        { new: true }
      ).catch((err) =>
        logger.error(
          "Error updating user lastSeen in socket handleUserOffline",
          err
        )
      )
    }

    const handleUserOnlineStatus = async (userId: string, callback: any) => {
      const online = this.onlineUsers.has(userId)

      let updatedAt = null
      if (!online) {
        const user = await User.findById(userId).select("updatedAt")
        updatedAt = user?.updatedAt
      }

      callback(online, updatedAt)
    }

    socket.on(USER_CONNECTED, handleUserConnected)
    socket.on(USER_ONLINE, handleUserOnline)
    socket.on(USER_OFFLINE, handleUserOffline)
    socket.on(USER_ONLINE_STATUS, handleUserOnlineStatus)
  }

  /**
   * Handles chat room related events (joining, creating, deleting)
   * Socket.io rooms are used to group connections for targeted message broadcasting
   */
  private setupChatHandlers(socket: Socket) {
    const handleJoinChat = (chatId: string) => {
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
    }

    // Handle user joining a chat
    socket.on(JOIN_CHAT, handleJoinChat)
  }

  /**
   * Handles message-related events (new messages, typing indicators, message deletion)
   */
  private setupMessageHandlers(socket: Socket) {
    const handleNewMessage = (
      data: { chatId: string; message: Message; messageUsers: string[] },
      callback: any
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
                if (!messageUser) {
                  return
                }
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

    const handleSeenAndReceiveMessage = (data: {
      receiver: string
      chatId: string
      messageId: string
      status: "seen" | "receive"
    }) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGE, data)
    }

    const handleSeenAndReceiveMessages = (data: {
      receiver: string
      chatId: string // It is not always from the selected chat
      numberOfMessages: number
      status: "seen" | "receive"
    }) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGES, data)
    }

    const handleTyping = (data: {
      chatId: string
      userId: string
      isTyping: boolean
    }) => {
      socket.to(data.chatId).emit(TYPING, data) // Broadcast typing status to everyone in the chat except the typer
    }

    socket.on(NEW_MESSAGE, handleNewMessage) // Handle new message event
    socket.on(SEEN_AND_RECEIVE_MESSAGE, handleSeenAndReceiveMessage) // This will broatcast one message
    socket.on(SEEN_AND_RECEIVE_MESSAGES, handleSeenAndReceiveMessages) // This will broadcast whole chat receive and seen status
    socket.on(TYPING, handleTyping) // Handle typing indicator events
  }

  /**
   * Handles user disconnection events
   * Cleans up user data and notifies other users
   */
  private setupDisconnectHandler(socket: Socket) {
    const handleDisconnect = () => {
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
    }

    socket.on("disconnect", handleDisconnect)
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
