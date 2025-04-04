import { Router } from "express"
import { createChat, deleteChat, getAndUpdateChat, getChatsAndMessages } from "../controllers/chat.controller.js"
import {  requireAuth } from "@clerk/express"

const router = Router()

router.route("/create").post(requireAuth(), createChat)
router.route("/delete").post(requireAuth(), deleteChat)
router.route("/get").post(requireAuth(), getChatsAndMessages)
router.route("/getupdatechat").post(requireAuth(), getAndUpdateChat)

export default router
