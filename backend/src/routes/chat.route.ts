import { Router } from "express"
import { createChat, deleteChat } from "../controllers/chat.controller.js"

const router = Router()

router.route("/create").post(createChat)
router.route("/delete").post(deleteChat)

export default router
