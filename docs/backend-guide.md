# Backend Guide

The backend is built with **Node.js**, **Express**, and **TypeScript**.

## Folder Structure (`backend/src`)

- **`controllers/`**: Request handlers for routes.
- **`db/`**: Database connection logic.
- **`middlewares/`**: Express middlewares (Auth, Error handling, Multer).
- **`models/`**: Mongoose schemas and models.
- **`routes/`**: API route definitions.
- **`services/`**: Business logic (optional layer).
- **`types/`**: TypeScript type definitions.
- **`utils/`**: Helper functions (e.g., APIResponse, APIError).
- **`app.ts`**: Express app setup.
- **`index.ts`**: Entry point, server startup.

## Key Technologies

- **Database**: MongoDB with Mongoose.
- **Authentication**: JWT-based auth (or Clerk integration).
- **File Uploads**: Multer + Cloudinary.
- **Real-time**: Socket.io.

## Development Tips

- **Error Handling**: Use the custom `ApiError` class for consistent error responses.
- **Response Format**: Use the `ApiResponse` class to send standard JSON responses.
- **Async Handlers**: Wrap controller functions with `asyncHandler` to avoid try-catch blocks for async errors.
