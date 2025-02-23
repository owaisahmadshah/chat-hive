import mongoose from "mongoose"
import logger from "../logger.js"

const dbConnect = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
    )
    logger.info(
      `MongoDB connect! DB host: ${connectionInstance.connection.host}`
    )
  } catch (error) {
    logger.error(`\nmongo db connection error ${error}\n`)
    process.exit(1)
  }
}

export default dbConnect
