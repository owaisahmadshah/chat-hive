import { Router } from "express"
import { createChat, deleteChat, getChatsAndMessages } from "../controllers/chat.controller.js"

const router = Router()

router.route("/create").post(createChat)
router.route("/delete").post(deleteChat)
router.route("/get").post(getChatsAndMessages)

export default router
