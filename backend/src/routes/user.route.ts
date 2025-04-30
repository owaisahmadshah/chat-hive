import { Router } from "express"
import {
  createFriend,
  createUser,
  deleteFriend,
  deleteUser,
  getFriends,
  getUser,
  usersSuggestion,
} from "../controllers/user.controller.js"
import { requireAuth } from "@clerk/express"

const router = Router()

router.route("/signup").post(createUser)
router.route("/delete").post(deleteUser, requireAuth())
router.route("/user").post(getUser, requireAuth())
router.route("/suggestions").post(usersSuggestion, requireAuth())
router.route("/create-friend").post(createFriend, requireAuth())
router.route("/delete-friend").post(deleteFriend, requireAuth())
router.route("/get-friends").post(getFriends, requireAuth())

export default router
