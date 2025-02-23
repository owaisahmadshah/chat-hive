import { Router } from "express"

import { healthCheck } from "../controllers/healthcheck.controller.js"

const router = Router()

//* api/v1/healthcheck
router.route("/").get(healthCheck)

export default router