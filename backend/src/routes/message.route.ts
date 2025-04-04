import { Router } from "express"
import { requireAuth } from "@clerk/express"

import { upload } from "../middlewares/multer.middleware.js"
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
    requireAuth(),
    upload.fields([{ name: "uploadedImage", maxCount: 1 }]),
    createMessage
  )
router.route("/delete").post(requireAuth(), deleteMessage)
router.route("/updatestatus").post(requireAuth(), updateMessagesStatus)
router.route("/updateonestatus").post(requireAuth(), updateMessageStatus)

export default router
