import { Router } from "express"
import { createChat, deleteChat, getAndUpdateChat, getChatsAndMessages } from "../controllers/chat.controller.js"
import { requireAuth } from "@clerk/express"

const router = Router()

/**
 * @route POST /api/v1/chat/create
 * @desc Create a new chat
 * @access Private
 * @requires Authentication
 */
router.route("/create").post(requireAuth(), createChat)

/**
 * @route POST /api/v1/chat/delete
 * @desc Delete an existing chat
 * @access Private
 * @requires Authentication
 */
router.route("/delete").post(requireAuth(), deleteChat)

/**
 * @route POST /api/v1/chat/get
 * @desc Get all chats and their messages for the authenticated user
 * @access Private
 * @requires Authentication
 */
router.route("/get").post(requireAuth(), getChatsAndMessages)

/**
 * @route POST /api/v1/chat/getupdatechat
 * @desc Get and update chat information
 * @access Private
 * @requires Authentication
 */
router.route("/getupdatechat").post(requireAuth(), getAndUpdateChat)

export default router
