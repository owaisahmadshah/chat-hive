import { Router } from "express"

import { userController } from "./user.container.js"
import { auth } from "../../shared/middlewares/auth.middleware.js"
import { upload } from "../../shared/middlewares/multer.middleware.js"

const router = Router()

// Public routes
router.route("/signup").post(userController.createUser)
router.route("/verify-otp").post(userController.verifyOtpAndSetNewPassword)
router.route("/sign-in").post(userController.signIn)
router.route("/resend-otp").post(userController.resendOtp)
router.route("/refresh-token").post(userController.generateRefreshAccessToken)
router.route("/unique-username").get(userController.uniqueUsername)
router.route("/create-dummy").post(userController.createDummyUser)

// Private routes
router.route("/delete").delete(auth, userController.deleteUser)
router.route("/change-password").post(auth, userController.changePassword)
router.route("/user").post(auth, userController.getUser)
router.route("/suggestions").post(auth, userController.usersSuggestion)
router
  .route("/update-profile-image")
  .post(
    auth,
    upload.fields([{ name: "profileImage", maxCount: 1 }]),
    userController.uploadProfileImage
  )
router.get("/recommended-users", auth, userController.recommendedUsers)

export { router as userRouter }
