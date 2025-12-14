# API Reference

Base URL: `/api/v1`

## Authentication & User (`/user`)

### Public Routes
- **POST** `/signup`: Register a new user.
- **POST** `/verify-otp`: Verify OTP and set password.
- **POST** `/sign-in`: Login with credentials.
- **POST** `/resend-otp`: Resend verification OTP.
- **POST** `/refresh-token`: Refresh access token.
- **GET** `/unique-username`: Check if a username is available.

### Private Routes (Requires Auth)
- **POST** `/user`: Get current user details.
- **DELETE** `/delete`: Delete user account.
- **POST** `/change-password`: Change user password.
- **POST** `/update-user-fields`: Update user profile fields.
- **POST** `/update-profile-image`: Upload/update profile picture.
- **POST** `/create-friend`: Add a friend.
- **DELETE** `/delete-friend`: Remove a friend.
- **POST** `/get-friends`: Get list of friends.
- **POST** `/suggestions`: Get user suggestions.

## Chat (`/chat`)

- **POST** `/create`: Create a new chat (1-on-1 or group).
- **DELETE** `/delete`: Delete a chat.
- **POST** `/get`: Get all chats and their messages.
- **POST** `/getupdatechat`: Get and update chat info.
- **POST** `/messages`: Get messages for a specific chat (pagination).

## Messages (`/message`)

- **POST** `/create`: Send a new message (supports image upload).
- **DELETE** `/delete`: Delete a message.
- **POST** `/updatestatus`: Update status of multiple messages (e.g., read).
- **POST** `/updateonestatus`: Update status of a single message.

## Socket.io Events

### Client -> Server
- `join_chat`: Join a chat room.
- `new_message`: Send a message.
- `typing`: Emit typing status.
- `stop_typing`: Emit stop typing status.

### Server -> Client
- `message_received`: Receive a new message.
- `typing`: Receive typing status of others.
- `stop_typing`: Receive stop typing status.
