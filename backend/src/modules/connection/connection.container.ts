import { ConnectionRepository } from "./connection.repository.js"
import { ConnectionService } from "./connection.service.js"
import { ConnectionController } from "./connection.controller.js"

const connectionRepository = new ConnectionRepository()

const connectionService = new ConnectionService({ connectionRepository })

const connectionController = new ConnectionController({ connectionService })

export { connectionRepository, connectionService, connectionController }
