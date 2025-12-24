import dbConnect from "./shared/db/dbConnect.js"
import { socketHttpServer } from "./socket/socket.js"
import logger from "./shared/utils/logger.js"

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
