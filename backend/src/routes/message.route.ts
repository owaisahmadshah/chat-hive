import { Router } from "express"

import { upload } from "../middlewares/multer.middleware.js"
import {
  createMessage,
  deleteMessage,
} from "../controllers/message.controller.js"

const router = Router()

// api/v1/message/...
router
  .route("/create")
  .post(upload.fields([{ name: "uploadedImage", maxCount: 1 }]), createMessage)
router.route("/delete").post(deleteMessage)

export default router
