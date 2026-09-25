# Chat Hive

A real-time chat application featuring live messaging, status tracking, image sharing, device session management, and responsive UI.

## Documentation

- [Server README](./server/README.md) — NestJS API, Socket.IO gateways, database, and architecture notes
- [Client README](./client/README.md) — React frontend, routing, and architecture notes

## Features

- **Real-time messaging** — Socket.IO powered with scale-ready Redis Adapter integration.
- **Message state & read receipts** — Track delivery states (`sent` → `received` → `seen`) live across active conversations.
- **Typing indicators** — Real-time indicators showing active typing state in conversations.
- **Image uploads & media preview** — Integrated Cloudinary signature workflow for image sharing and lightbox viewing.
- **Authentication & session management** — Email OTP verification, login via device metadata tracking, token refresh rotation, and multi-device session invalidation (logout single, other, or all devices).
- **Profile customization** — Update profile pictures, alter password, and manage security parameters.
- **Theme support** — Dark and light themes powered by `next-themes`.
- **Infinite scroll pagination** — Cursor-based pagination for chat history and user lists via TanStack Query v5.
- **Monorepo architecture** — Monorepo powered by `pnpm` workspace with a unified shared package for types, Zod schemas, and contract validations.

---

## Tech Stack

### Monorepo Architecture

- **Package Manager:** `pnpm` 10.x (Workspaces)
- **Shared Package:** TypeScript core library containing shared Zod schemas, NestJS JWT helpers, and contract definitions.

### Server (`server`)

See the [server README](./server/README.md) for the full breakdown.

- **Framework:** NestJS v11 (Express platform)
- **Real-Time:** Socket.IO v4 with Redis Adapter (`@socket.io/redis-adapter`, `ioredis`)
- **Database & ORM:** PostgreSQL (`pg`), Drizzle ORM, Drizzle Kit
- **Authentication & Security:** JWT (`@nestjs/jwt`), `bcrypt`, `cookie-parser`
- **Validation:** Zod (`zod`) with custom NestJS validation pipes
- **Mail & Media:** Nodemailer / `@nestjs-modules/mailer`, Cloudinary SDK
- **Logging:** `nestjs-pino`, `pino-pretty`

### Client (`client`)

See the [client README](./client/README.md) for the full breakdown.

- **Framework & Tooling:** React 19, Vite 8, TypeScript 6
- **Styling:** Tailwind CSS v4, `@tailwindcss/vite`, `clsx`, `tailwind-merge`
- **UI Components & Icons:** Radix UI / Base UI (`@base-ui/react`), `shadcn`, Lucide Icons (`lucide-react`)
- **State & Data Fetching:** TanStack React Query v5, Axios
- **Forms & Validation:** React Hook Form, `@hookform/resolvers`, Zod
- **Media & UI Utilities:** `yet-another-react-lightbox`, `react-textarea-autosize`, `sonner`, `next-themes`

---

## Workspace Structure

```text
chat-hive/
├── client/           # React 19 + Vite 8 Frontend App
├── server/           # NestJS 11 + Drizzle ORM + Socket.IO Server
├── shared/           # Workspace package containing shared types & Zod schemas
└── package.json      # Workspace root package configuration
```

## License

[MIT](LICENSE)
