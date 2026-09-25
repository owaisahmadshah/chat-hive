# Chat Hive — Server

NestJS backend for Chat Hive, a real-time chat application. Handles authentication, chat and message persistence, live messaging over Socket.IO, presence tracking, and media upload signing.

## Tech Stack

- **Framework:** NestJS 11 (Express platform)
- **Real-time:** Socket.IO 4 with a Redis adapter (`@socket.io/redis-adapter`, `ioredis`) for horizontal scaling across instances
- **Database:** PostgreSQL via `pg`, Drizzle ORM, Drizzle Kit for migrations
- **Auth:** JWT (`@nestjs/jwt`) with access/refresh token cookies, `bcrypt` password hashing, OTP email verification
- **Validation:** Zod schemas shared with the client via the `shared` workspace package, enforced through a custom `ZodValidationPipe`
- **Media:** Cloudinary signed uploads
- **Mail:** Nodemailer / `@nestjs-modules/mailer`
- **Logging:** `nestjs-pino`

## Architecture

- **HTTP API** is mounted under the `/api/v1` prefix (see `main.ts`).
- **WebSocket gateways** run on top of a `RedisIoAdapter`, so events fan out correctly across multiple server instances. `ChatGateway` runs on the `/chat` namespace; `PresenceGateway` runs on the default namespace and is responsible for tracking who's online.
- **Presence** is tracked in Redis (`PresenceRepository`), mapping user IDs to socket IDs and status. This lets the server push events to a specific user's socket even if they aren't in a given chat room (`emitToUserSocket`), and lets `checkUserPresence` answer "is this user online" queries.
- **Sessions/devices**: login and OTP verification accept device metadata (`deviceId`, `deviceName`, `platform`) so a user's sessions can be listed and revoked individually, in bulk, or "all except this one."
- **Response shape**: a global `ResponseTransformInterceptor` and `HttpExceptionFilter` normalize success and error payloads across all HTTP routes; `WsCatchAllFilter` does the equivalent for gateway exceptions.

## Project Structure

```text
server/
├── drizzle.config.ts
├── nest-cli.json
├── package.json
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── decorators/          # @CurrentUser, @Metadata
│   │   ├── filters/             # HTTP + WS exception filters
│   │   ├── guards/               # AuthGuard, RefreshTokenGuard
│   │   ├── interceptors/         # Response transform interceptor
│   │   └── pipes/                 # ZodValidationPipe
│   ├── core/
│   │   ├── config/                # env + config loading
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   ├── database.service.ts
│   │   │   ├── migrations/        # Drizzle SQL migrations + snapshots
│   │   │   ├── query-builders/    # chat-query-builder.ts
│   │   │   └── schema/            # chat, message, user schemas
│   │   └── redis/
│   │       ├── redis-io.adapter.ts
│   │       ├── redis.module.ts
│   │       ├── redis.service.ts
│   │       └── repositories/      # presence.repository.ts
│   ├── modules/
│   │   ├── auth/                  # controller, service, module, constants
│   │   ├── chats/
│   │   │   └── repositories/      # chat-members, chats
│   │   ├── email/
│   │   ├── healh-check/
│   │   ├── messages/
│   │   │   └── repositories/      # messages, message-status, message-attachment, message-delete
│   │   ├── realtime/
│   │   │   ├── gateways/          # chat.gateway.ts, presence.gateway.ts
│   │   │   ├── guards/            # ws-auth.guard.ts
│   │   │   └── middleware/
│   │   ├── uploads/                # controller, service, module
│   │   └── users/
│   │       ├── projections/       # user-session, users
│   │       └── repositories/      # user-session, users
│   └── shared/
│       ├── assertions.ts
│       ├── services/               # crypto.service.ts
│       ├── shared.module.ts
│       └── types/                  # controller-response, express.d, jwt-payload, socket.d
└── test/
    ├── app.e2e-spec.ts
    └── jest-e2e.json
```

## API Overview

### Auth (`/auth`)

| Method | Route              | Description                                        |
| ------ | ------------------ | -------------------------------------------------- |
| POST   | `/register`        | Create a new user account                          |
| POST   | `/login`           | Authenticate, set access/refresh cookies           |
| POST   | `/otp/verify`      | Verify OTP and activate account                    |
| POST   | `/otp/resend`      | Resend account OTP                                 |
| POST   | `/refresh-token`   | Rotate access/refresh tokens (`RefreshTokenGuard`) |
| DELETE | `/logout`          | Log out current device                             |
| DELETE | `/logout/all`      | Log out all devices                                |
| DELETE | `/logout/others`   | Log out all devices except current                 |
| PATCH  | `/new-password`    | Change password while authenticated                |
| POST   | `/forgot-password` | Send password-reset OTP                            |
| POST   | `/reset-password`  | Verify OTP and set a new password                  |

### Users (`/users`)

| Method | Route          | Description                         |
| ------ | -------------- | ----------------------------------- |
| GET    | `/profile`     | Get current user's profile          |
| GET    | `/profile/:id` | Get another user's profile by ID    |
| PATCH  | `/image-url`   | Update current user's profile image |
| GET    | `/:username`   | Paginated user search by username   |

### Chats (`/chats`)

| Method | Route                 | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | `/`                   | Create a chat                         |
| GET    | `/`                   | List current user's chats (paginated) |
| GET    | `/:chatId`            | Get a chat by ID                      |
| PATCH  | `/:chatId`            | Update chat details                   |
| POST   | `/member`             | Add members to a chat                 |
| PATCH  | `/member/change-role` | Change a member's role                |
| DELETE | `/member`             | Remove a member                       |
| DELETE | `/:chatId`            | Delete/leave a chat                   |

### Messages (`/messages`)

| Method | Route                 | Description                            |
| ------ | --------------------- | -------------------------------------- |
| POST   | `/`                   | Send a message                         |
| DELETE | `/:messageId`         | Delete a message                       |
| GET    | `/all/:chatId`        | Get messages for a chat (paginated)    |
| PATCH  | `/status/update-one`  | Update a single message's status       |
| PATCH  | `/status/update-many` | Update all message statuses for a chat |

### Uploads (`/uploads`)

| Method | Route        | Description                              |
| ------ | ------------ | ---------------------------------------- |
| POST   | `/signature` | Get a signed Cloudinary upload signature |

## Socket Events

**`/chat` namespace** (`ChatGateway`): `createNewChat`, `createNewMessage`, `joinChat`, `leaveChat`, `updateMessageStatus`, `updateAllMessagesStatuses`, `sendTyping` → broadcasts `receiveTyping`.

**Default namespace** (`PresenceGateway`): connection/disconnect drive presence state automatically; `updateStatus` and `checkUserPresence` are client-invoked. Status changes broadcast `userPresenceChanged` to all connected clients.

Both gateways expect a `user-id` handshake header (or an authenticated `client.user.sub`) to identify the socket owner.

## Getting Started

```bash
pnpm install

# generate and run DB migrations
pnpm db:generate
pnpm db:migrate

# start in watch mode
pnpm start:dev
```

### Environment Variables

The app expects a `.env` file (loaded via `--env-file=.env` for DB scripts, `dotenv`/`@nestjs/config` at runtime) with at least:

```
PORT=
CORS_ORIGIN=
DATABASE_PASSWORD=
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
NODE_MAILER_USER=
NODE_MAILER_PASSWORD=
NODE_ENV=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SERVER_URL=
CLIENT_URL=
REDIS_HOST=
REDIS_PORT=
```

### Scripts

| Script                                          | Description                               |
| ----------------------------------------------- | ----------------------------------------- |
| `pnpm start:dev`                                | Run with hot reload                       |
| `pnpm build`                                    | Compile to `dist/`                        |
| `pnpm start:prod`                               | Run compiled build                        |
| `pnpm db:generate` / `pnpm db:migrate`          | Drizzle migration workflow                |
| `pnpm db:push`                                  | Push schema directly (no migration files) |
| `pnpm lint`                                     | ESLint with autofix                       |
| `pnpm test` / `pnpm test:cov` / `pnpm test:e2e` | Jest unit/coverage/e2e tests              |

## License

MIT
