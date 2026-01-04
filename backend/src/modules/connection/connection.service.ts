import type { ConnectionRepository } from "./connection.repository.js"
import { ApiError } from "../../shared/utils/ApiError.js"

interface IConnectionServiceDeps {
  connectionRepository: ConnectionRepository
}

export class ConnectionService {
  constructor(private deps: IConnectionServiceDeps) {}

  async createConnection({
    senderId,
    receiverId,
  }: {
    senderId: string
    receiverId: string
  }) {
    const { connectionRepository } = this.deps

    const existingConnection =
      await connectionRepository.findConnectionBySenderAndReceiver({
        senderId,
        receiverId,
      })

    if (existingConnection) {
      throw new ApiError(400, "Connection exists")
    }

    const newConnection = await connectionRepository.createConnection({
      senderId,
      receiverId,
    })

    const populatedConnection = await connectionRepository.findById(
      (newConnection as any)._id.toString()
    )

    return populatedConnection
  }

  async deleteConnectionById({ connectionId }: { connectionId: string }) {
    const deleteConnection =
      await this.deps.connectionRepository.deleteConnectionById({
        connectionId,
      })

    if (!deleteConnection) {
      throw new ApiError(404, "Connection not found")
    }

    return deleteConnection
  }

  async findConnectionsBySenderId({ senderId }: { senderId: string }) {
    const connections =
      await this.deps.connectionRepository.findAllConnectionsBySenderId({
        senderId,
      })

    return connections
  }
}
