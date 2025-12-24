import { createServer } from "http"
import { Server, Socket } from "socket.io"

import { app } from "../app.js"
import logger from "../shared/utils/logger.js"
import { User } from "../modules/user/user.model.js"
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
  type handleSeenAndReceiveMessageType,
  type newMessageType,
  type handleSeenAndReceiveMessagesType,
  type typingType,
} from "shared"

interface User {
  userId: string
  socketId: string
  activeChat: string | null
}

/**
 * @desc    Manages all real-time socket connections and chat functionality.
 *          This class handles user connections, chat rooms, and message broadcasting.
 */
class SocketManager {
  private io: Server // Socket.io server instance

  /**
   * @desc    Tracks currently online users. Key: userId, Value: User object
   *          Used for quick lookup of user's connection and active chat
   */
  private activeUsers: Map<string, User>

  /**
   * @desc    Tracks which users are in which chat. Key: chatId, Value: Set of userIds
   *          Used to manage chat participants and broadcast messages efficiently
   */
  private chatRooms: Map<string, Set<string>>

  /**
   * @desc    Tracks all online users. Key: userId, Value: boolean
   */
  private onlineUsers: Map<string, boolean>

  constructor(server: Server) {
    this.io = server
    this.activeUsers = new Map() // Stores online users and their socket information
    this.chatRooms = new Map() // Tracks which users are in which chat rooms
    this.onlineUsers = new Map() // Tracks online status only
    this.initialize()
  }

  /**
   * @desc    Sets up the main socket.io connection handler and initializes event listeners
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
   * @desc    Handles user connection events and maintains active user tracking
   * @param {Socket} socket - The socket instance for the connected user
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
   * @desc    Handles chat room related events like joining and messaging
   * @param {Socket} socket - The socket instance for the connected user
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
   * @desc    Handles message-related events including new messages, status updates and typing
   * @param {Socket} socket - The socket instance for the connected user
   */
  private setupMessageHandlers(socket: Socket) {
    const handleNewMessage = (data: newMessageType, callback: any) => {
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

    const handleSeenAndReceiveMessage = (
      data: handleSeenAndReceiveMessageType
    ) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGE, data)
    }

    const handleSeenAndReceiveMessages = (
      data: handleSeenAndReceiveMessagesType
    ) => {
      socket.to(data.chatId).emit(SEEN_AND_RECEIVE_MESSAGES, data)
    }

    const handleTyping = (data: typingType) => {
      socket.to(data.chatId).emit(TYPING, data) // Broadcast typing status to everyone in the chat except the typer
    }

    socket.on(NEW_MESSAGE, handleNewMessage) // Handle new message event
    socket.on(SEEN_AND_RECEIVE_MESSAGE, handleSeenAndReceiveMessage) // This will broatcast one message
    socket.on(SEEN_AND_RECEIVE_MESSAGES, handleSeenAndReceiveMessages) // This will broadcast whole chat receive and seen status
    socket.on(TYPING, handleTyping) // Handle typing indicator events
  }

  /**
   * @desc    Handles user disconnection cleanup
   * @param {Socket} socket - The socket instance for the disconnected user
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
