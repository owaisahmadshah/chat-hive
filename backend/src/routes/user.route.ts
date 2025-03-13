import { Router } from "express"
import { createUser, deleteUser } from "../controllers/user.controller.js"

const router = Router()

router.route("/signup").post(createUser)
router.route("/delete").post(createUser)

export default router