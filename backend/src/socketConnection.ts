import { app } from "./app.js"
import { createServer } from "http"
import { Server } from "socket.io"

const socketHttpServer = createServer(app)
const io = new Server(socketHttpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

io.on("connection", (socket) => {})

export { socketHttpServer }
