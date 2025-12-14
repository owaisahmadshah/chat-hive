# Getting Started with Chat-Hive

This guide will help you set up the **Chat-Hive** project locally for development.

## Prerequisites

- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (recommended)
- **MongoDB**: Local instance or Atlas URI
- **Cloudinary Account**: For image storage
- **Clerk Account**: For authentication

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/owaisahmadshah/chat-hive.git
    cd chat-hive
    ```

2.  **Install dependencies:**

    Since this is a monorepo, install dependencies for both frontend and backend from the root:

    ```bash
    pnpm install
    ```

## Environment Setup

### Backend

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a `.env` file based on `.env.samples`:
    ```bash
    cp .env.samples .env
    ```
3.  Fill in the environment variables:
    ```env
    PORT=3000
    CORS_ORIGIN=http://localhost:5173 # Adjust if your frontend runs on a different port
    DB_NAME=chat-hive
    MONGODB_URI=mongodb://localhost:27017/chat-hive # Or your Atlas URI

    # Cloudinary Credentials
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

### Frontend

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Create a `.env` file based on `.env.sample`:
    ```bash
    cp .env.sample .env
    ```
3.  Fill in the environment variables:
    ```env
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    API_BASE_URL=http://localhost:3000/api
    ```

## Running the Application

You can run the application in development mode from the root directory:

```bash
# Run both frontend and backend
pnpm dev
```

Or run them separately:

```bash
# Frontend only (http://localhost:5173)
pnpm dev:frontend

# Backend only (http://localhost:3000)
pnpm dev:backend
```

## Building for Production

To build both packages for production:

```bash
pnpm build
```
