import { Router } from "express"

import { auth } from "../../shared/middlewares/auth.middleware.js"
import { connectionController } from "./connection.container.js"

const router = Router()

router.post("/create", auth, connectionController.createConnection)
router.delete(
  "/delete/:connectionId",
  auth,
  connectionController.deleteConnectionById
)
router.get("/get-connections", auth, connectionController.getMyConnections)

export { router as connectionRouter }
