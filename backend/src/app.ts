import express from "express"
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"

import logger from "./shared/utils/logger.js"

const app = express()

/**
 * Morgan logging format string
 * @type {string}
 */
const morganFormat = ":method :url :status :response-time ms"

// Configure middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
)
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

/**
 * Morgan middleware configuration for HTTP request logging
 * Logs request details in a structured format
 */
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        }
        logger.info(JSON.stringify(logObject))
      },
    },
  })
)

// Import route handlers
import healthCheckRouter from "./modules/health-check/healthCheck.route.js"
import { chatRouter } from "./modules/chat/chat.route.js"
import { messageRouter } from "./modules/message/message.route.js"
import { userRouter } from "./modules/user/user.route.js"

// Register API routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/chat", chatRouter)
app.use("/api/v1/message", messageRouter)
app.use("/api/v1/user", userRouter)

// Error middleware
import { errorHandler } from "./shared/middlewares/error.middleware.js"

app.use(errorHandler)

export { app }
