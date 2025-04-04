import { Router } from "express"
import { requireAuth } from "@clerk/express"

import { upload } from "../middlewares/multer.middleware.js"
import {
  createMessage,
  deleteMessage,
  updateMessagesStatus,
} from "../controllers/message.controller.js"

const router = Router()

// api/v1/message/...
router
  .route("/create")
  .post(requireAuth(), upload.fields([{ name: "uploadedImage", maxCount: 1 }]), createMessage)
router.route("/delete").post(requireAuth(), deleteMessage)
router.route("/udpatestatus").post(requireAuth(), updateMessagesStatus)

export default router
