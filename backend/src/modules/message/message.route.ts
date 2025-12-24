import { Router } from "express"

import { auth } from "../../shared/middlewares/auth.middleware.js"
import { upload } from "../../shared/middlewares/multer.middleware.js"

import { messageController } from "./message.container.js"

const router = Router()

// api/v1/message/...
router
  .route("/create")
  .post(
    auth,
    upload.fields([{ name: "uploadedImage", maxCount: 15 }]),
    messageController.createMessage
  )
router.route("/delete").delete(auth, messageController.deleteMessage)
router.route("/updatestatus").post(auth, messageController.updateMessagesStatus)
router
  .route("/updateonestatus")
  .post(auth, messageController.updateMessageStatus)

export { router as messageRouter }
