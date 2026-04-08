import jwt from "jsonwebtoken"
import crypto from "crypto"

import { UserRepository } from "./user.repository.js"
import { UserService } from "./user.service.js"
import { UserController } from "./user.controller.js"
import { chatRepository } from "../chat/chat.container.js"

import { generateOTP, generateExpiryTime } from "../../shared/utils/otp.js"
import sendEmail from "../../shared/utils/sendEmail.js"
import { uploadOnCloudinary } from "../../shared/utils/Cloudinary.js"

const userRepository = new UserRepository()

const userService = new UserService({
  userRepository,
  generateExpiryTime,
  generateOTP,
  chatRepository,
  jwt,
  sendEmail,
  uploadOnCloudinary,
  crypto,
})

const userController = new UserController({ userService })

export { userRepository, userService, userController }
