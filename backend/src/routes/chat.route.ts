import { Router } from "express"

import {
  createChat,
  deleteChat,
  getAndUpdateChat,
  getChatsAndMessages,
  getMoreMessages,
} from "../controllers/chat.controller.js"
import { auth } from "../middlewares/auth.middleware.js"

const router = Router()

/**
 * @route POST /api/v1/chat/create
 * @desc Create a new chat
 * @access Private
 * @requires Authentication
 */
router.route("/create").post(auth, createChat)

/**
 * @route POST /api/v1/chat/delete
 * @desc Delete an existing chat
 * @access Private
 * @requires Authentication
 */
router.route("/delete").delete(auth, deleteChat)

/**
 * @route POST /api/v1/chat/get
 * @desc Get all chats and their messages for the authenticated user
 * @access Private
 * @requires Authentication
 */
router.route("/get").post(auth, getChatsAndMessages)

/**
 * @route POST /api/v1/chat/getupdatechat
 * @desc Get and update chat information
 * @access Private
 * @requires Authentication
 */
router.route("/getupdatechat").post(auth, getAndUpdateChat)

/**
 * @route POST /api/v1/chat/messages
 * @desc Get messages of a specific chat
 * @access Private
 * @requires Authentication
 */
router.route("/messages").post(auth, getMoreMessages)

export default router
