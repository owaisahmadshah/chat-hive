import express from "express"
import morgan from "morgan"
import cors from "cors"

import logger from "./logger.js"

const app = express()

const morganFormat = ":method :url :status :response-time ms"

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
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

// import routes
import healthCheckRouter from "./routes/healthCheck.route.js"
import chatRoute from "./routes/chat.route.js"

// routes
app.use("/api/v1/healthcheck", healthCheckRouter)
app.use("/api/v1/chat", chatRoute)

export { app }
