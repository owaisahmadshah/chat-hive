import type { Request, Response } from "express"

import type { ConnectionService } from "./connection.service.js"
import { ApiError } from "../../shared/utils/ApiError.js"
import { asyncHandler } from "../../shared/utils/AsyncHandler.js"
import { ApiResponse } from "../../shared/utils/ApiResponse.js"

interface IConnectionControllerDeps {
  connectionService: ConnectionService
}

export class ConnectionController {
  constructor(private deps: IConnectionControllerDeps) {}

  /**
   * @desc    Create a new connection between two users
   * @route   POST /api/v1/connection/create
   * @access  Private
   *
   * @param {Request} req - Express request object containing receiverId
   * @param {Response} res - Express response object
   */
  createConnection = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authenticated user not found in request")
    }

    const { receiverId } = req.body

    if (!receiverId) {
      throw new ApiError(400, "ReceiverId is required")
    }

    const connection = await this.deps.connectionService.createConnection({
      senderId: req.user._id,
      receiverId,
    })

    return res
      .status(201)
      .json(new ApiResponse(201, connection, "Connection created successfully"))
  })

  /**
   * @desc    Delete an existing connection by connectionId
   * @route   DELETE /api/v1/connection/delete
   * @access  Private
   *
   * @param {Request} req - Express request object containing connectionId
   * @param {Response} res - Express response object
   */
  deleteConnectionById = asyncHandler(async (req: Request, res: Response) => {
    const { connectionId } = req.params

    if (!connectionId) {
      throw new ApiError(400, "ConnectionId is required")
    }

    await this.deps.connectionService.deleteConnectionById({ connectionId })

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Connection deleted successfully"))
  })

  /**
   * @desc    Get all connections created by the authenticated user
   * @route   GET /api/v1/connection/my-connections
   * @access  Private
   *
   * @param {Request} req - Express request object (authenticated user)
   * @param {Response} res - Express response object containing connections list
   */
  getMyConnections = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, "Authenticated user not found in request")
    }

    const connections =
      await this.deps.connectionService.findConnectionsBySenderId({
        senderId: req.user._id,
      })

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { connections },
          "Connections fetched successfully"
        )
      )
  })
}
