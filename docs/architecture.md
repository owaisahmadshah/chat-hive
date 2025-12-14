# Architecture Overview

**Chat-Hive** is a real-time chat application built using the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Technology Stack

### Frontend
- **Framework**: React.js (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **State Management**: Redux-toolkit
- **Authentication**: JWT
- **Real-time Client**: Socket.io Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Real-time Server**: Socket.io
- **Image Storage**: Cloudinary

## System Design

### High-Level Flow

1.  **User Authentication**: User sign in through JWT.
2.  **API Requests**: Authenticated requests are sent to the Express backend with a token.
3.  **Real-time Communication**:
    - Upon login, a Socket.io connection is established.
    - Messages are sent via Socket.io events for instant delivery.
    - Messages are also persisted to MongoDB for history.
4.  **Image Uploads**: Images are uploaded to Cloudinary via the backend, and the URL is stored in the message.

### Database Schema (Simplified)

- **Users**: Stores user profile info (synced from Clerk or stored locally).
- **Chats**: Represents a conversation between users (1-on-1 or Group).
- **Messages**: Individual messages linked to a Chat and User.

### Real-time Events

- `connection`: Client connects to the server.
- `join_chat`: Client joins a specific chat room.
- `new_message`: Server broadcasts a new message to the room.
- `typing`: User typing status updates.
