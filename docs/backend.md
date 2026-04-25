# Chat Hive — Backend

Express + Socket.IO backend for the Chat Hive real-time messaging app. Handles auth, chat, messages, user connections, and live events.

---

## What it does

- REST API for users, chats, messages, and social connections
- Real-time messaging via Socket.IO (new messages, typing indicators, read receipts)
- Two auth strategies: local (email + OTP) and Google OAuth 2.0
- Image uploads to Cloudinary (profile photos, message images)
- OTP delivery via Nodemailer (Gmail)
- MongoDB with Mongoose, Winston logging, morgan HTTP logs

---

## Folder Structure

```
backend/
├── src/
│   ├── index.ts              # Entry point: connects DB, starts server
│   ├── app.ts                # Express app, middleware, route registration
│   ├── modules/
│   │   ├── user/             # Auth, profile, account management
│   │   ├── chat/             # 1-on-1 chat sessions
│   │   ├── message/          # Messages within chats
│   │   ├── connection/       # Social connections between users
│   │   └── health-check/     # /healthcheck ping
│   ├── shared/
│   │   ├── db/               # MongoDB connection
│   │   ├── middlewares/      # auth, error handler, multer
│   │   ├── utils/            # ApiError, ApiResponse, Cloudinary, email, OTP, logger
│   │   └── types/            # Shared TypeScript types
│   └── socket/
│       ├── socket.server.ts  # Creates http.Server + Socket.IO instance
│       ├── socket.manager.ts # Wires up all socket handlers on each connection
│       ├── socket.container.ts # DI: exports activeUsers + socketService singletons
│       ├── handlers/         # Per-event handler registration
│       ├── services/         # SocketService (emit helpers)
│       └── stores/           # In-memory state (active users, chat rooms, online status)
├── public/                   # Static files (default profile picture)
├── scripts/                  # Utility scripts
├── .env                      # Secrets (not committed)
└── .env.samples              # Template for required env vars
```

Each module follows the same pattern: `model → repository → service → controller → container → route`. The container is where dependencies get wired together (manual DI).

---

## Auth

### Local (email + password)

1. **Signup** — user submits email, username, password. An OTP is emailed immediately; the account is created but `isVerified: false`.
2. **OTP verification** — user submits the OTP via `/verify-otp`. On success the account is marked verified and optionally a new password is set.
3. **Sign in** — user submits email/username + password. If unverified, a fresh OTP is sent and a 403 is returned. If verified, tokens are issued.

### Google OAuth 2.0

Implemented manually — no Passport.js.

1. `GET /api/v1/user/google` — generates a random `state` cookie and redirects the browser to Google's consent screen.
2. Google redirects back to `GET /api/v1/user/google/callback` with a `code`.
3. The server exchanges the code for tokens, decodes the `id_token` (base64 JWT payload — no library), extracts `sub`, `email`, and `picture`.
4. Three possible outcomes:
   - **Returning Google user** — `googleId` already in DB → issue tokens.
   - **Email matches local account** — links `googleId` to the existing user.
   - **New user** — creates a new account with a generated unique username.
5. Tokens are set as cookies and the user is redirected to `FRONTEND_URL/`.

### JWT Tokens

Two tokens are issued on every successful sign-in:

| Token | Expiry | Payload |
|---|---|---|
| `accessToken` | 10 min (cookie: 50 min) | `_id`, `email`, `username` |
| `refreshToken` | 14 days (cookie: 25 days) | `_id` |

Both tokens are `httpOnly` cookies. In production (`NODE_ENV=PRODUCTION`) they're `secure` and `sameSite: none`.

**`POST /api/v1/user/refresh-token`** — verifies the refresh token, confirms it matches the one stored in the DB (rotation check), and issues a new pair.

### Auth Middleware

`src/shared/middlewares/auth.middleware.ts`

Reads the access token from `req.cookies.accessToken` or the `Authorization: Bearer <token>` header. Verifies it, looks up the user, and attaches `{ _id, email, username }` to `req.user`. All private routes go through this middleware.

---

## API Routes

All routes are prefixed with `/api/v1`.

### User — `/api/v1/user`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | Public | Create account, send OTP |
| `POST` | `/verify-otp` | Public | Verify OTP, optionally set password |
| `POST` | `/sign-in` | Public | Sign in, returns access + refresh tokens as cookies |
| `POST` | `/resend-otp` | Public | Resend OTP to email |
| `POST` | `/refresh-token` | Public | Rotate tokens using refresh token |
| `GET` | `/unique-username` | Public | Check if a username is available (`?username=`) |
| `GET` | `/google` | Public | Redirect to Google OAuth consent screen |
| `GET` | `/google/callback` | Public | Google OAuth callback handler |
| `POST` | `/sign-out` | Private | Clear tokens, invalidate refresh token in DB |
| `POST` | `/user` | Private | Get current user's profile |
| `DELETE` | `/delete` | Private | Delete account + all associated chats and messages |
| `PATCH` | `/change-password` | Private | Change password (Google-linked accounts trigger OTP flow) |
| `PATCH` | `/update-profile-image` | Private | Upload new profile image to Cloudinary (multipart) |
| `GET` | `/suggestions` | Private | Search users by username (`?username=`) |
| `GET` | `/recommended-users` | Private | Paginated list of users to connect with (`?limit=&cursor=`) |
| `GET` | `/chat-user` | Private | Fetch a specific user's details for a chat (`?userId=`) |

### Chat — `/api/v1/chat`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | Private | Create a new 1-on-1 chat or return existing one |
| `DELETE` | `/delete` | Private | Soft-delete a chat (adds userId to `deletedBy`) |
| `GET` | `/chats` | Private | Paginated list of authenticated user's chats (`?limit=&cursor=`) |
| `POST` | `/getupdatechat` | Private | Fetch a chat by ID and update its `deletedBy` if needed |

### Message — `/api/v1/message`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | Private | Send a message (text, single image, or multiple images) |
| `DELETE` | `/delete` | Private | Soft-delete a message (adds userId to `deletedBy`) |
| `POST` | `/updatestatus` | Private | Bulk-update all messages in a chat (e.g., mark all as received) |
| `POST` | `/updateonestatus` | Private | Update a single message's status |
| `GET` | `/messages` | Private | Paginated messages for a chat (`?chatId=&limit=&cursor=`) |

### Connection — `/api/v1/connection`

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/create` | Private | Create a connection between the current user and another |
| `DELETE` | `/delete/:connectionId` | Private | Remove a connection by ID |
| `GET` | `/get-connections` | Private | Get all connections created by the current user |

### Health Check — `/api/v1/healthcheck`

`GET /api/v1/healthcheck` — returns 200. Used for uptime monitoring.

---

## Socket.IO

The Socket.IO server shares the same HTTP server as Express (`http.createServer(app)`). CORS is restricted to `FRONTEND_URL`.

### Architecture

`SocketManager` boots on startup and registers four handler groups for every new connection:

- **User handlers** — connection tracking and online status
- **Chat handlers** — room joining
- **Message handlers** — typing and read receipt relay
- **Disconnect handler** — cleanup

`SocketService` is a singleton that the HTTP layer (message service) calls to push events after DB operations. It holds a reference to the `io` instance.

`ActiveUsersStore` is an in-memory `Map<userId, { socketId, activeChat }>`. It's the source of truth for "is this user connected and which chat are they in?"

### Events

**Client → Server (emitted by client, handled by server)**

| Event | Payload | What happens |
|---|---|---|
| `USER_CONNECTED` | `userId: string` | Registers user in `ActiveUsersStore` |
| `USER_ONLINE` | `userId: string` | Adds to `OnlineUsersStore`, updates `lastSeen` in DB |
| `USER_OFFLINE` | `userId: string` | Removes from `OnlineUsersStore`, updates `lastSeen` in DB |
| `USER_ONLINE_STATUS` | `userId: string, callback` | Callback returns `(isOnline: boolean, lastSeen: Date \| null)` |
| `JOIN_CHAT` | `chatId: string` | Joins Socket.IO room, updates `activeChat` in `ActiveUsersStore` |
| `SEEN_AND_RECEIVE_MESSAGE` | `{ chatId, messageId, receiver, status }` | Relayed to the chat room |
| `SEEN_AND_RECEIVE_MESSAGES` | `{ chatId, receiver, status, numberOfMessages }` | Relayed to the chat room |
| `TYPING` | `{ chatId, ... }` | Relayed to the chat room |

**Server → Client (emitted by server)**

| Event | Payload | Trigger |
|---|---|---|
| `NEW_MESSAGE` | `{ message, messageUsers }` | After a message is created via REST |
| `SEEN_AND_RECEIVE_MESSAGE` | status update object | After single message status update via REST |
| `SEEN_AND_RECEIVE_MESSAGES` | status update object | After bulk message status update via REST |
| `USER_DISCONNECTED` | `userId: string` | When a connected user's socket disconnects |

### Delivery fallback

When `NEW_MESSAGE` is emitted to a chat room, a 2-second timeout is used with Socket.IO's acknowledgement system. If no acknowledgement comes back (nobody in the room confirmed receipt), the server falls back to emitting directly to the receiver's `socketId`.

---

## Database Models

### User

| Field | Type | Notes |
|---|---|---|
| `email` | String | Unique, indexed |
| `username` | String | Unique, indexed |
| `imageUrl` | String | Default: `./default-profile-picture.jpg` |
| `password` | String | Nullable (Google-only users have no password) |
| `authProvider` | `"local" \| "google"` | Set to `local` by default |
| `googleId` | String | Nullable, sparse unique index |
| `isVerified` | Boolean | Must be true before sign-in |
| `isSignedIn` | Boolean | |
| `refreshToken` | String | Stored for rotation validation |
| `otp` | String | Nullable, cleared after use |
| `otpExpiry` | Date | OTPs are valid for ~10 min |

Instance methods: `isPasswordCorrect(password)`, `generateAccessToken()`, `generateRefreshToken()`. Password is hashed with bcrypt (10 rounds) in a `pre('save')` hook.

### Chat

| Field | Type | Notes |
|---|---|---|
| `users` | `ObjectId[]` | Refs to User — the two participants |
| `deletedBy` | `ObjectId[]` | Soft delete: user IDs who have "deleted" this chat |

### Message

| Field | Type | Notes |
|---|---|---|
| `sender` | `ObjectId` | Ref to User, indexed |
| `chatId` | `ObjectId` | Ref to Chat, indexed |
| `message` | String | Text content (optional if image provided) |
| `photoUrl` | String | Cloudinary URL, empty string if no image |
| `status` | `"sent" \| "receive" \| "seen"` | Delivery/read status |
| `deletedBy` | `ObjectId[]` | Soft delete per user |

### Connection

| Field | Type | Notes |
|---|---|---|
| `sender` | `ObjectId` | Ref to User, indexed |
| `receiver` | `ObjectId` | Ref to User, indexed |

Represents a directional follow/connection from one user to another.

---

## Environment Variables

```env
# Server
PORT=3000
NODE_ENV=DEVELOPMENT           # Set to PRODUCTION for secure cookies

# CORS
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://...
DB_NAME=chat-hive

# JWT
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Nodemailer (Gmail)
NODE_MAILER_USER=your-gmail@gmail.com
NODE_MAILER_PASSWORD=your-app-password
```

> For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833), not your account password.

---

## Error Handling

All controllers use `asyncHandler` which wraps async route handlers and forwards errors to the global error middleware (`src/shared/middlewares/error.middleware.ts`).

`ApiError` is a subclass of `Error` that carries a `statusCode`. The error middleware serializes it into a consistent JSON shape.

`ApiResponse` is a plain wrapper: `{ statusCode, data, message, success }`.

---

## Running Locally

```bash
pnpm install
cp .env.samples .env   # fill in your values
pnpm dev               # tsx watch, auto-restarts on change
```

Build for production:

```bash
pnpm build    # tsc → dist/
pnpm start    # node dist/index.js
```

---

## Logging

Winston is used for structured logging, piped through morgan for HTTP requests. Logs go to `app.log` in the root of the backend directory. Each HTTP request is logged as a JSON object with `method`, `url`, `status`, and `responseTime`.
