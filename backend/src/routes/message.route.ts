import { Router } from "express"

import { upload } from "../middlewares/multer.middleware.js"
import { auth } from "../middlewares/auth.middleware.js"

import {
  createMessage,
  deleteMessage,
  updateMessagesStatus,
  updateMessageStatus,
} from "../controllers/message.controller.js"

const router = Router()

// api/v1/message/...
router
  .route("/create")
  .post(
    auth,
    upload.fields([{ name: "uploadedImage", maxCount: 1 }]),
    createMessage
  )
router.route("/delete").delete(auth, deleteMessage)
router.route("/updatestatus").post(auth, updateMessagesStatus)
router.route("/updateonestatus").post(auth, updateMessageStatus)

export default router
