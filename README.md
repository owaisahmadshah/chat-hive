# 💬 Chat Hive

🚀 A real-time chat application where users can send messages, share images, and communicate instantly.

## 📌 Features

-   🔥 **Real-time Messaging** – Instant communication using WebSockets.
-   🖼 **Image Sharing** – Send and receive pictures seamlessly.
-   🔒 **Secure Authentication** – User authentication with Clerk.
-   📡 **Fast & Scalable** – Built with modern web technologies for smooth performance.

## 🛠 Tech Stack

-   ⚡ **Frontend:** React.js, Shadcn, Tailwind CSS, Zod
-   ⚡ **Backend:** Node.js, Express.js, TypeScript
-   ⚡ **Database:** MongoDB
-   ⚡ **Real-time:** Socket.io
-   ⚡ **Storage:** Cloudinary

## 📂 Project Structure

This project is organized as a monorepo using pnpm workspaces:

-   `frontend/` - React application with Shadcn UI components
-   `backend/` - Express.js server with Socket.io integration

## 📦 Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/owaisahmadshah/chat-hive.git
    cd chat-hive
    ```

2. **Install pnpm (if not installed):**

    ```bash
    npm install -g pnpm
    ```

3. **Install dependencies:**
    ```bash
    pnpm install
    ```

## 🚀 Development

Run both frontend and backend in development mode:

```bash
pnpm dev
```

Or run them separately:

```bash
# Frontend only
pnpm dev:frontend

# Backend only
pnpm dev:backend
```

## 🏗️ Building for Production

Build both packages:

```bash
pnpm build
```

## 🧹 Linting

Lint both packages:

```bash
pnpm lint
```
