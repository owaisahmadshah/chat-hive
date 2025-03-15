import { Router } from "express"
import { createUser, deleteUser, getUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/signup").post(createUser)
router.route("/delete").post(deleteUser)
router.route("/user").get(getUser)

export default router
