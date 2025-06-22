import { Router } from "express"
import {
  createFriend,
  createUser,
  deleteFriend,
  deleteUser,
  getFriends,
  getUser,
  updateUserShowStatus,
  uploadProfileImage,
  usersSuggestion,
} from "../controllers/user.controller.js"
import { requireAuth } from "@clerk/express"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/signup").post(createUser)
router.route("/delete").delete(deleteUser, requireAuth())
router.route("/user").post(getUser, requireAuth())
router.route("/suggestions").post(usersSuggestion, requireAuth())
router.route("/create-friend").post(createFriend, requireAuth())
router.route("/delete-friend").delete(deleteFriend, requireAuth())
router.route("/get-friends").post(getFriends, requireAuth())
router.route("/update-user-fields").post(updateUserShowStatus, requireAuth())
router
  .route("/update-profile-image")
  .post(
    requireAuth(),
    upload.fields([{ name: "profileImage", maxCount: 1 }]),
    uploadProfileImage
  )

export default router
