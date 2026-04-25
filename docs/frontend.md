# Chat Hive — Frontend

React + Vite frontend for Chat Hive. Real-time messaging UI with Socket.IO, cursor-based infinite scroll, and both local and Google OAuth auth flows.

---

## What it does

- Two-panel layout: chat list on the left, active conversation on the right
- Real-time updates via Socket.IO (new messages, typing indicators, read receipts)
- Infinite scroll for both the chat list and message history
- Optimistic UI updates — the message appears instantly, socket delivers it to the other side
- Dark/light theme toggle (persisted in localStorage)
- Mobile-responsive: panels swap based on which one is active
- Image uploads in messages (multiple files), with preview lightbox before sending
- Profile management: avatar upload, password change, account deletion

---

## Folder Structure

```
frontend/src/
├── main.tsx                  # Entry point — providers stack
├── App.tsx                   # Routes definition
├── index.css                 # Global styles + Tailwind base
├── routes/
│   ├── HomePage.tsx          # Main app shell (chat + message panels)
│   └── PrivateRoute.tsx      # Auth-aware route guard
├── features/
│   ├── auth/                 # Sign-in, sign-up pages + auth logic
│   │   ├── SignIn.tsx
│   │   ├── SignUp.tsx
│   │   ├── hooks/useAuth.ts  # Auth operations (signUp, signIn, verifyOtp…)
│   │   ├── services/authService.ts
│   │   └── types/            # Zod schemas for forms
│   ├── chat-section/         # Left panel: chat list, profile, create chat
│   │   ├── ChatSection.tsx
│   │   ├── Components/       # ChatItem, Profile, CreateChat, etc.
│   │   ├── hooks/            # Data fetching + mutations for chats
│   │   ├── services/chatService.ts
│   │   └── utils/            # React Query cache update helpers
│   └── message-section/      # Right panel: message list + input
│       ├── MessageSection.tsx
│       ├── components/       # MessageItem, MessageInput, Navbar, etc.
│       ├── hooks/            # Data fetching + mutations for messages
│       ├── services/messageService.ts
│       └── utils/            # React Query cache update helpers
├── socket/
│   ├── socket.instance.ts    # Socket singleton (createSocket / destroySocket)
│   └── hooks/
│       ├── useInitSocket.ts  # Sets up all socket listeners
│       ├── useChatEmitter.ts # JOIN_CHAT, TYPING emitters
│       └── usePresenceEmitter.ts # USER_ONLINE/OFFLINE/STATUS emitters
├── store/
│   ├── store.ts              # Redux store
│   └── slices/user.ts        # User auth state
├── hooks/                    # Global custom hooks
├── services/                 # Global API functions (user, message)
├── lib/
│   ├── axiosInstance.ts      # Axios instance + token refresh interceptor
│   └── utils.ts              # clsx/tailwind-merge helper
├── components/               # Shared UI: Loader, LoadMore, Typing, etc.
│   └── ui/                   # shadcn/ui components
└── types/                    # TypeScript interfaces
```

---

## Tech Stack

| Concern | Library |
|---|---|
| Framework | React 19 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI primitives | Radix UI / shadcn/ui |
| Server state | TanStack Query v5 |
| Client state | Redux Toolkit |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Sockets | Socket.IO Client v4 |
| Routing | React Router v7 |
| Toasts | Sonner |
| Image lightbox | yet-another-react-lightbox |
| Icons | Lucide React |
| Date formatting | date-fns |

---

## Providers Stack

```
Redux Provider
  └── ThemeProvider (next-themes, default: dark)
        └── BrowserRouter
              └── QueryClientProvider
                    └── Toaster (sonner, top-right)
                          └── App
```

**QueryClient defaults**: `staleTime: 5 min`, `refetchOnWindowFocus: true`, `refetchOnReconnect: true`, mutations retry once.

---

## Routing

Three routes, all wrapped in `PrivateRoute`:

| Path | Component | Guard behaviour |
|---|---|---|
| `/` | `HomePage` | Requires auth → redirects to `/sign-in` if not signed in |
| `/sign-in` | `SignInForm` | Redirects to `/` if already signed in |
| `/sign-up` | `SignUpForm` | Redirects to `/` if already signed in |

`PrivateRoute` reads `isSignedIn` and `isLoading` from the Redux user slice. While loading it renders nothing (prevents flash). Once resolved it redirects or renders children.

---

## Auth State

On every page load, `useGetUser` fires a `POST /v1/user/user` request. If it succeeds, the user is hydrated into Redux (`setUser`). If it fails (401, network error), `clearUser` is dispatched.

The Redux `user` slice holds:

```ts
{
  userId: string
  email: string
  username: string
  imageUrl: string
  isLoading: boolean   // true until the first fetch resolves
  isSignedIn: boolean
}
```

Sign-out clears the Redux state, clears the React Query cache, and resets URL params.

---

## Auth Pages

### Sign Up flow

1. User submits email, username, password (validated with Zod).
2. While typing the username, it's debounce-checked against `/v1/user/unique-username` and shows availability inline.
3. On submit → `POST /v1/user/signup`. On success, an OTP screen appears.
4. User enters the 6-digit OTP → `POST /v1/user/verify-otp`. On success, redirects to sign-in.

### Sign In flow

1. User submits email/username + password.
2. If the account exists but isn't verified, the server returns 403 and a fresh OTP is sent. The OTP screen appears.
3. On success → tokens are set as `httpOnly` cookies server-side; the client has no direct access to them.

### Google OAuth

Clicking "Continue with Google" redirects the browser to `VITE_API_BASE_URL/v1/user/google`. The entire OAuth flow happens server-side. After completion the server sets cookies and redirects back to the frontend root.

### Forgot password

Accessed from the sign-in page. User enters their email/username, receives an OTP, then submits the OTP + new password to `/v1/user/verify-otp`.

---

## HTTP Client

`src/lib/axiosInstance.ts` creates a single Axios instance:

- `baseURL`: `VITE_API_BASE_URL`
- `withCredentials: true` — required for the `httpOnly` cookie auth to work

**Token refresh interceptor**: on a 401 response with `"Unauthorized"` or `"Unauthorized: Invalid or expired token"`, the interceptor automatically calls `POST /v1/user/refresh-token` and retries the original request once. If the refresh also fails, the error propagates normally (user lands back at sign-in).

---

## Socket

### Instance management

`socket.instance.ts` is a singleton module. The `socket` variable is module-scoped.

- `createSocket()` — creates the socket if it doesn't exist, returns it. Uses `transports: ['websocket']`, auto-reconnects with exponential backoff (1s → 5s, infinite attempts).
- `getSocket()` — returns the existing socket or `null`.
- `destroySocket()` — disconnects and nullifies the reference.

### Initialization

`useInitSocket` runs once when `userId` is available. It calls `createSocket()`, emits `USER_CONNECTED`, and registers four listeners. The cleanup function removes all listeners when the component unmounts or `userId` changes.

On reconnect, it re-emits `USER_CONNECTED` and invalidates the `chats` and `messages` React Query caches so stale data gets refetched.

### Event listeners (incoming)

| Event | What the client does |
|---|---|
| `NEW_MESSAGE` | Acknowledges receipt. If the chat doesn't exist locally, fetches it and joins the room. Appends message to the `["messages", chatId]` query cache. Updates `lastMessage` in the `["chats"]` cache. Emits read status (`seen` or `receive` based on whether that chat is currently open). Increments unread count if the chat isn't active. |
| `TYPING` | Updates the typing state in the `["chats"]` cache for the chat list indicator. If it's the active chat, also updates the `["user", userId]` cache so the navbar shows "typing…". |
| `SEEN_AND_RECEIVE_MESSAGE` | Updates a single message's status in the `["messages", chatId]` cache. |
| `SEEN_AND_RECEIVE_MESSAGES` | Bulk-updates all messages' statuses for a chat in the cache. |

### Emitters

**`useChatEmitter`**
- `joinChat(chatId)` — emits `JOIN_CHAT`. Called for every chat in the list on load so the client is in all relevant Socket.IO rooms.
- `sendTyping(isTyping)` — emits `TYPING` with the current `chatId` and `userId`.

**`usePresenceEmitter`**
- `sendOnline()` — emits `USER_ONLINE` with the current user's ID.
- `sendOffline()` — emits `USER_OFFLINE`.
- `getOnlineStatus(targetUserId)` — emits `USER_ONLINE_STATUS` with a callback. On response, patches the `["user", targetUserId]` cache with `isUserOnline` and `updatedAt`.

**`usePresenceStatus`** — wires visibility/focus/blur events to the presence emitters. When the tab becomes visible with an active chat, it also bulk-marks messages as seen. Avoids duplicate status emits by tracking `lastStatus`.

**`useUserOnlineStatus`** — polling hook in `MessageSection` that calls `getOnlineStatus` every 10 seconds for the active chat's user.

---

## Data Fetching

All server state lives in React Query. The cache is the source of truth — socket events write into it directly instead of triggering refetches.

### Query keys

| Key | Data |
|---|---|
| `["chats"]` | Infinite paginated chat list (cursor-based, 20 per page) |
| `["messages", chatId]` | Infinite paginated messages for a chat (cursor-based, 25 per page, newest first) |
| `["user", userId]` | Chat user's profile + online status |

### Key hooks

| Hook | What it does |
|---|---|
| `useFetchInfiniteChats` | `useSuspenseInfiniteQuery` for the chat list. staleTime: 15 min |
| `useFetchInfiniteMessages` | `useSuspenseInfiniteQuery` for messages. staleTime: 20 min |
| `useCreateChat` | `useMutation` → creates a chat, invalidates `["chats"]` |
| `useDeleteChat` | `useMutation` → soft-deletes a chat, invalidates `["chats"]` |
| `useFetchChat` | Fetches a single chat by ID (used when a new message arrives for an unknown chat) |
| `useSendMessage` | `useMutation` → sends a message. On success, optimistically reorders the chat to the top and updates `lastMessage` in the cache |
| `useDeleteMessage` | `useMutation` → removes message from cache on success |
| `useProfileImageUpdate` | `useMutation` → uploads via `multipart/form-data`, updates Redux user state |
| `useSignOutUser` | `useMutation` → calls sign-out, clears full React Query cache and Redux state |

---

## Home Page Layout

The home page state is URL-driven:

- `?chatId=<id>&userId=<id>` — a chat is open
- No params — no chat selected

`ChatSection` (left panel) and `MessageSection` (right panel) both receive `activeChatId` and `activeChatUserId` as props. The parent (`HomePage`) owns the URL params and passes a setter down.

On mobile, only one panel is visible at a time. `ChatSection` hides itself when params are set; `MessageSection` hides when they're not.

**Initial hooks fired on home page load:**
1. `useGetUser()` — hydrates user into Redux
2. `useInitSocket()` — connects socket, registers listeners
3. `usePresenceStatus()` — wires presence events
4. `useMobileHeight()` — sets `--visual-height` CSS variable to handle mobile browser chrome (avoids the 100dvh jump)

---

## Chat Section

`ChatSection.tsx` is the left panel. On mount, it joins all loaded chat rooms by emitting `JOIN_CHAT` for each chat in the list. This is necessary so the client receives `NEW_MESSAGE` events for all chats, not just the active one.

Key components:

| Component | Role |
|---|---|
| `Profile` | Avatar that opens a settings dialog (profile image, theme toggle, change password, sign out, delete account) |
| `CreateChat` | Search by username, show results, initiate a new chat |
| `ChatItem` | Single row in the chat list: avatar, last message preview, unread badge, typing indicator |
| `ChatLastMessagePreview` | Renders last message text/image preview with status icon |

---

## Message Section

`MessageSection.tsx` is the right panel. Shows `NoChatSelected` when no chat is active. Uses `ErrorBoundary` + `Suspense` around both the navbar and the messages list independently, so an error in one doesn't kill the other.

Key components:

| Component | Role |
|---|---|
| `MessageNavbarSection` | Shows other user's avatar, online status, back button, delete chat action |
| `MessagesList` | Infinite scroll message list with `LoadMore` at top for older messages |
| `MessageItem` | Individual message: text and/or image, timestamp, status icon (sent/received/seen), delete action |
| `MessageInput` | Text area + image upload. Sends `TYPING` events while typing (auto-stops after 1.5s idle). Enter sends, Shift+Enter adds newline. Supports multi-image preview before sending. |

**MessageInput** image flow: files are accumulated in local state, previewed in a scrollable strip with remove buttons, and a lightbox opens on click (zoom + download). On submit, all images go as `multipart/form-data`.

---

## Typing Indicator

When the user types in `MessageInput`:
1. `sendTyping(true)` emits `TYPING` immediately.
2. A `setTimeout(1500ms)` resets it to `false`.
3. On blur, `sendTyping(false)` fires immediately.

On the receiving end, `useInitSocket`'s `handleTyping` updates the `["chats"]` cache and the active chat user's query data, which the typing indicator components read from.

---

## Read Receipts

Message status: `sent` → `receive` → `seen`.

When a new message arrives:
- If the chat is currently open **and the tab is visible** → status updates to `seen`
- Otherwise → `receive`

The status update is sent via both the REST API (`POST /v1/message/updateonestatus`) and the `SEEN_AND_RECEIVE_MESSAGE` socket event (so the sender sees the tick change live).

When a user opens a chat (or refocuses the tab with an active chat), `updateMessagesStatus` is called to bulk-mark all unread messages as `seen`.

---

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_REACT_APP_SOCKET_URL=http://localhost:3000
```

All Vite env vars must be prefixed with `VITE_` to be accessible in the browser.

---

## Running Locally

```bash
pnpm install
cp .env.sample .env   # fill in your values
pnpm dev              # starts on http://localhost:5173
```

Build:

```bash
pnpm build    # tsc + vite build → dist/
pnpm preview  # serves the built output locally
```

---

## Component Patterns

**Suspense + ErrorBoundary**: `useSuspenseInfiniteQuery` is used throughout, so components suspend while loading. Each section has its own `ErrorBoundary` with a fallback component, keeping failures isolated.

**Skeleton screens**: dedicated skeleton components (`MessagesListSkeleton`, `MessageNavbarSectionSekeleton`, `MessageInputSkeleton`, `HomePageSkeleton`) are used as Suspense fallbacks instead of spinners.

**Cache mutation pattern**: socket events and mutations write to the React Query cache directly with `queryClient.setQueryData` instead of invalidating and refetching. This keeps the UI responsive and avoids unnecessary network requests.
