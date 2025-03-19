import { Router } from "express"
import {
  createUser,
  deleteUser,
  getUser,
  usersSuggestion,
} from "../controllers/user.controller.js"
import { requireAuth } from "@clerk/express"

const router = Router()

router.route("/signup").post(createUser)
router.route("/delete").post(deleteUser, requireAuth())
router.route("/user").post(getUser, requireAuth())
router.route("/suggestions").post(usersSuggestion, requireAuth())

export default router
