import type { Request, Response, NextFunction } from "express"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../../modules/user/user.model.js"
import type { IRequestUser } from "../types/index.js"

interface JwtPayloadWithId extends jwt.JwtPayload {
  _id: string
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token =
    req.cookies.accessToken ||
    req["headers"].authorization?.replace(/^Bearer\s+/i, "").trim()

  if (!token) {
    return next(new ApiError(401, "Unauthorized"))
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as JwtPayloadWithId

    const user = await User.findById(decodedToken._id).select(
      "_id email username"
    )

    if (!user) {
      throw new ApiError(404, "User not found")
    }

    const requestUser: IRequestUser = {
      _id: user._id as string,
      email: user.email,
      username: user.username,
    }

    req.user = requestUser

    next()
  } catch (error) {
    return next(new ApiError(401, "Unauthorized: Invalid or expired token"))
  }
}
