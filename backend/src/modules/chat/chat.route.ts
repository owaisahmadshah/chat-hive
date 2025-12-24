import { Router } from "express"

import { chatController } from "./chat.container.js"
import { auth } from "../../shared/middlewares/auth.middleware.js"

const router = Router()

/**
 * @route POST /api/v1/chat/create
 * @desc Create a new chat
 * @access Private
 * @requires Authentication
 */
router.post("/create", auth, chatController.createChat)

/**
 * @route POST /api/v1/chat/delete
 * @desc Delete an existing chat
 * @access Private
 * @requires Authentication
 */
router.delete("/delete", auth, chatController.deleteChat)

/**
 * @route POST /api/v1/chat/get
 * @desc Get all chats and their messages for the authenticated user
 * @access Private
 * @requires Authentication
 */
router.post("/get", auth, chatController.getChatsAndMessages)

/**
 * @route POST /api/v1/chat/getupdatechat
 * @desc Get and update chat information
 * @access Private
 * @requires Authentication
 */
router.post("/getupdatechat", auth, chatController.getAndUpdateChat)

/**
 * @route POST /api/v1/chat/messages
 * @desc Get messages of a specific chat
 * @access Private
 * @requires Authentication
 */
router.post("/messages", auth, chatController.getMoreMessages)

export { router as chatRouter }
