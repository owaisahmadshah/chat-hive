import { v2 as cloudinary } from "cloudinary"
import fs from "fs"
import logger from "../logger.js"

cloudinary.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) {
      return null
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    })
    logger.info("File uploaded on cloudinary. File src: " + response.url)

    fs.unlinkSync(localFilePath)
    return response
  } catch (error) {
    logger.error("Error uploading image to cloudinary", error)
    fs.unlinkSync(localFilePath)
    return null
  }
}
