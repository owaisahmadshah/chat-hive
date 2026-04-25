# Chat Hive

A real-time chat app. Send messages, share images, see who's typing, and know when your messages are read, all live.

## Features

- **Real-time messaging** — Socket.IO powered. Messages appear instantly on the other side.
- **Read receipts** — sent → received → seen, updated live.
- **Typing indicators** — shown in both the chat list and the active conversation.
- **Image sharing** — send up to 15 images per message. Preview before sending, view full-screen with zoom and download.
- **Auth** — email + OTP verification, or Google OAuth 2.0. No third-party auth service.
- **Token rotation** — short-lived access tokens (10 min) auto-refreshed using a 14-day refresh token. Transparent to the user.
- **Profile management** — update avatar, change password, delete account.
- **Dark / light theme** — persisted per-browser.
- **Infinite scroll** — cursor-based pagination for both the chat list and message history.
- **Mobile responsive** — single-panel view on small screens, switches between chat list and messages.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 6, TypeScript, Tailwind CSS v4 |
| UI | Radix UI / shadcn/ui, Lucide icons |
| State | Redux Toolkit (auth), TanStack Query v5 (server state) |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express 4, TypeScript |
| Database | MongoDB + Mongoose |
| Real-time | Socket.IO v4 |
| Storage | Cloudinary (images) |
| Email | Nodemailer (Gmail, OTP delivery) |
| Monorepo | pnpm workspaces |

## Project Structure

```
chat-hive/
├── frontend/     # React + Vite app
├── backend/      # Express + Socket.IO server
├── shared/       # Shared TypeScript types and socket event constants
└── docs/         # Documentation
    ├── backend.md
    └── frontend.md
```

The `shared` package is a local workspace dependency used by both `frontend` and `backend`. It holds Zod schemas, TypeScript types, and socket event name constants so both sides stay in sync.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10+ (`npm install -g pnpm`)
- A MongoDB database
- A Cloudinary account
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833)
- A Google OAuth 2.0 Client ID and Secret (from [Google Cloud Console](https://console.cloud.google.com/))

### 1. Clone

```bash
git clone https://github.com/owaisahmadshah/chat-hive.git
cd chat-hive
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

**Backend** — copy `backend/.env.samples` to `backend/.env` and fill in:

```env
PORT=3000
NODE_ENV=DEVELOPMENT
CORS_ORIGIN=http://localhost:5173
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=chat-hive

ACCESS_TOKEN_SECRET=a_long_random_string
REFRESH_TOKEN_SECRET=another_long_random_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_MAILER_USER=your_gmail@gmail.com
NODE_MAILER_PASSWORD=your_gmail_app_password
```

**Frontend** — copy `frontend/.env.sample` to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REACT_APP_SOCKET_URL=http://localhost:3000
```

### 4. Run in development

```bash
# Run everything (frontend + backend + shared watcher)
pnpm dev

# Or individually
pnpm dev:frontend
pnpm dev:backend
pnpm dev:shared     # watches shared package for changes
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:3000`.

## Build for Production

```bash
# Build everything (compiles shared → backend → frontend)
pnpm build

# Or individually
pnpm build:backend
pnpm build:frontend

# Start the backend server (after building)
pnpm start:backend
```

## Documentation

- [Backend docs](docs/backend.md) — API routes, auth flows, socket events, database models, environment variables
- [Frontend docs](docs/frontend.md) — folder structure, routing, state management, socket client, data fetching patterns

## License

[MIT](LICENSE)
