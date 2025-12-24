import type { Request, Response } from "express"

import { asyncHandler } from "../../shared/utils/AsyncHandler.js"
import { ApiResponse } from "../../shared/utils/ApiResponse.js"

const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  return res.status(200).json(new ApiResponse(200, {}, "success"))
})

export { healthCheck }
