import dbConnect from "./db/dbConnect.js"
import { socketHttpServer } from "./services/socket.js"
import logger from "./utils/logger.js"

const PORT = process.env.PORT

dbConnect()
  .then(() => {
    socketHttpServer.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    logger.error("Mongodb connection error", error)
  })
