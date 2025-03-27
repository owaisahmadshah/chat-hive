import { Router } from "express"
import { createChat, deleteChat, getChat, getChatsAndMessages } from "../controllers/chat.controller.js"
import {  requireAuth } from "@clerk/express"

const router = Router()

router.route("/create").post(requireAuth(), createChat)
router.route("/delete").post(requireAuth(), deleteChat)
router.route("/get").post(requireAuth(), getChatsAndMessages)
router.route("/getchat").post(requireAuth(), getChat)

export default router
