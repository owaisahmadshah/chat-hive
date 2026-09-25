# Chat Hive — Client

React frontend for Chat Hive. Handles auth flows, the chat/message UI, real-time updates over Socket.IO, and image uploads.

## Tech Stack

- **Framework & Tooling:** React 19, Vite 8, TypeScript 6
- **Routing:** React Router 7 (`PrivateRoute` gates authenticated vs. guest-only pages)
- **Styling:** Tailwind CSS v4, `@tailwindcss/vite`, `clsx`, `tailwind-merge`, `tailwindcss-animate`
- **UI Components & Icons:** Base UI (`@base-ui/react`), `shadcn`, Lucide Icons
- **State & Data Fetching:** TanStack React Query v5, Axios
- **Forms & Validation:** React Hook Form, `@hookform/resolvers`, Zod (schemas shared with the server via the `shared` workspace package)
- **Real-time:** `socket.io-client`
- **Media & UI Utilities:** `yet-another-react-lightbox`, `react-textarea-autosize`, `sonner` (toasts), `next-themes` (dark/light)

## Project Structure

```text
client/
├── index.html
├── package.json
├── public/                          # favicon, icon sprite
├── src/
│   ├── main.tsx                     # provider tree: Theme → Router → QueryClient → User → Socket
│   ├── App.tsx                      # route definitions
│   ├── index.css
│   ├── components/                  # shared UI (skeletons, mode toggle, user profile card, shadcn primitives in ui/)
│   ├── context/
│   │   ├── socket/                  # socket-context, socket-manager (singleton), socket-provider
│   │   ├── theme-context.ts / theme-provider.tsx
│   │   └── user-context.ts / user-provider.tsx
│   ├── features/
│   │   ├── auth/                    # SignIn, SignUp, ForgotPassword, OTP/reset flows + hooks + services
│   │   ├── chat/                    # ChatSection, chat list components, hooks, services, cache utils
│   │   └── messages/                # MessageSection, message list/input/navbar components, hooks, services
│   ├── hooks/                       # cross-feature hooks (active chat, socket events, reconnect sync, mobile height, etc.)
│   ├── lib/                         # api.ts (Axios instance), upload-to-cloudinary.ts, date/util helpers
│   ├── routes/                      # HomePage, PrivateRoute
│   └── services/                    # global-services.ts
└── vite.config.ts
```

## Architecture Notes

- **API client** (`lib/api.ts`): a shared Axios instance with `withCredentials: true`. A response interceptor unwraps the server's `{ success, data }` envelope and, on a `401` with an expired access token, transparently calls `/auth/refresh-token` once and retries the original request.
- **Sockets** (`context/socket/`): `SocketManager` is a plain singleton (not a hook) that owns two `socket.io-client` connections — one to the default namespace, one to `/chat` — keyed off the current user ID, and exposes them to React via `useSyncExternalStore`. `SocketContextProvider` connects/disconnects the sockets as the authenticated user changes.
- **Auth/session gating** (`routes/PrivateRoute.tsx`): reads auth state from `UserContext`, shows a loader while session state is resolving, and redirects between `/`, `/sign-in`, `/sign-up`, and `/forgot-password` based on `isAuthenticated`.
- **Uploads** (`lib/upload-to-cloudinary.ts`): fetches a signed upload signature from the server, then uploads directly to Cloudinary's REST API from the browser and normalizes the result (`image` / `video` / `audio` / `file`).
- **Feature folders**: `auth`, `chat`, and `messages` each keep their own `components/`, `hooks/`, and `services/`, with React Query hooks as the boundary between UI and API/socket calls.

## Getting Started

```bash
pnpm install
pnpm dev
```

### Environment Variables

```
VITE_API_BASE_URL=   # e.g. http://localhost:3000
VITE_WS_URL=         # Socket.IO server URL, e.g. http://localhost:3000
```

### Scripts

| Script         | Description                     |
| -------------- | ------------------------------- |
| `pnpm dev`     | Start the Vite dev server       |
| `pnpm build`   | Type-check (`tsc -b`) and build |
| `pnpm preview` | Preview the production build    |
| `pnpm lint`    | ESLint                          |

## License

MIT
