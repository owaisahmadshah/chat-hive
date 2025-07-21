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
  verifyOtpAndSetNewPassword,
  signIn,
  resendOtp,
  generateRefreshAccessToken,
  changePassword,
  uniqueUsername,
} from "../controllers/user.controller.js"
import { upload } from "../middlewares/multer.middleware.js"
import { auth } from "../middlewares/auth.middleware.js"

const router = Router()

// Public routes
router.route("/signup").post(createUser)
router.route("/verify-otp").post(verifyOtpAndSetNewPassword)
router.route("/sign-in").post(signIn)
router.route("/resend-otp").post(resendOtp)
router.route("/refresh-token").post(generateRefreshAccessToken)
router.route("/unique-username").get(uniqueUsername)

// Private routes
router.route("/delete").delete(auth, deleteUser)
router.route("/delete-friend").delete(auth, deleteFriend)
router.route("/change-password").post(auth, changePassword)
router.route("/user").post(auth, getUser)
router.route("/create-friend").post(auth, createFriend)
router.route("/suggestions").post(auth, usersSuggestion)
router.route("/update-user-fields").post(auth, updateUserShowStatus)
router.route("/get-friends").post(auth, getFriends)
router
  .route("/update-profile-image")
  .post(
    auth,
    upload.fields([{ name: "profileImage", maxCount: 1 }]),
    uploadProfileImage
  )

export default router
