import dbConnect from "./db/dbConnect.js"
import { app } from "./app.js"
import logger from "./logger.js"

const PORT = process.env.PORT

dbConnect()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    logger.error("Mongodb connection error", error)
  })
