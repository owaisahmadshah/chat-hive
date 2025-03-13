import { app } from "./app.js"
import { createServer } from "http"
import { Server } from "socket.io"

import {
  NEW_MESSAGE,
  NEW_CHAT,
  DELETE_MESSAGE,
  DELETE_CHAT,
  TYPING,
} from "./constants.js"

const socketHttpServer = createServer(app)
const io = new Server(socketHttpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// Keep track of active users
const activeUsers = new Map() // userId -> socketId

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id)

  // Handle user joining with their userId
  socket.on("join_user", (userId: string) => {
    activeUsers.set(userId, socket.id)
    console.log(`User ${userId} joined with socket ${socket.id}`)
  })

  // Handle joining a chat room
  socket.on("join_chat", (chatId: string) => {
    socket.join(chatId)
    console.log(`Socket ${socket.id} joined chat room: ${chatId}`)
  })

  // Handle leaving a chat room
  socket.on("leave_chat", (chatId: string) => {
    socket.leave(chatId)
    console.log(`Socket ${socket.id} left chat room: ${chatId}`)
  })

  // Handle new message in a chat room
  socket.on(NEW_MESSAGE, (data: any) => {
    const { chatId, message, sender } = data
    
    // Emit the message to everyone in the chat room except the sender
    socket.to(chatId).emit(NEW_MESSAGE, {
      chatId,
      message,
      sender,
      timestamp: new Date()
    })
    
    console.log(`New message in chat ${chatId} from ${sender}`)
  })

  // Handle typing indicator in a chat room
  socket.on(TYPING, (data: any) => {
    const { chatId, userId, isTyping } = data
    socket.to(chatId).emit(TYPING, { userId, isTyping })
  })

  // Handle new chat creation
  socket.on(NEW_CHAT, (data: any) => {
    const { participants, chatId, sender } = data
    
    // Make all participants join the new chat room
    participants.forEach((participantId: string) => {
      const participantSocketId = activeUsers.get(participantId)
      if (participantSocketId && participantSocketId !== socket.id) {
        io.to(participantSocketId).emit(NEW_CHAT, {
          chatId,
          sender,
          participants
        })
      }
    })
  })

  // Handle chat deletion
  socket.on(DELETE_CHAT, (data: any) => {
    const { chatId, participants } = data
    
    // Notify all participants about chat deletion
    participants.forEach((participantId: string) => {
      const participantSocketId = activeUsers.get(participantId)
      if (participantSocketId && participantSocketId !== socket.id) {
        io.to(participantSocketId).emit(DELETE_CHAT, { chatId })
      }
    })
  })

  // Handle message deletion
  socket.on(DELETE_MESSAGE, (data: any) => {
    const { chatId, messageId } = data
    socket.to(chatId).emit(DELETE_MESSAGE, { messageId })
  })

  // Handle disconnection
  socket.on("disconnect", () => {
    // Remove user from activeUsers
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId)
        break
      }
    }
    console.log("User disconnected:", socket.id)
  })
})

export { socketHttpServer } 