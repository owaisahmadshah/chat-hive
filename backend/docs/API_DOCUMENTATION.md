# API Documentation

## Base URL
`/api/v1`

## Authentication
All endpoints require authentication via Clerk. Include the Bearer token in the Authorization header.

## Chat Endpoints

### Create Chat
- **Route**: `POST /chat/create`
- **Body**:
  ```typescript
  {
    admin: string,    // User ID of chat creator
    users: string[]   // Array of user IDs in chat
  }
  ```
- **Response**: Created chat object with user details

### Delete Chat
- **Route**: `POST /chat/delete`
- **Body**:
  ```typescript
  {
    userId: string,   // User requesting deletion
    chatId: string    // Chat to delete
  }
  ```
- **Response**: Deletion confirmation

### Get User Chats
- **Route**: `POST /chat/get`
- **Body**:
  ```typescript
  {
    userId: string    // User whose chats to retrieve
  }
  ```
- **Response**: Array of chats with messages

### Get/Update Chat
- **Route**: `POST /chat/getupdatechat`
- **Body**:
  ```typescript
  {
    chatId: string    // Chat to retrieve/update
  }
  ```
- **Response**: Updated chat details

### Get Chat Messages
- **Route**: `POST /chat/messages`
- **Body**:
  ```typescript
  {
    chatId: string,         // Chat ID
    userId: string,         // Requesting user
    userChatMessages: number // Message count
  }
  ```
- **Response**: Array of messages

## Message Endpoints

### Create Message
- **Route**: `POST /message/create`
- **Body**: FormData with:
  ```typescript
  {
    chatId: string,     // Target chat
    message: string,    // Message content
    sender: string,     // Sender ID
    isPhoto?: boolean   // If message is an image
  }
  ```
- **Response**: Created message object

### Delete Message
- **Route**: `POST /message/delete`
- **Body**:
  ```typescript
  {
    messageId: string,  // Message to delete
    userId: string     // User requesting deletion
  }
  ```
- **Response**: Deletion confirmation

### Update Message Status
- **Route**: `POST /message/updatestatus`
- **Body**:
  ```typescript
  {
    chatId: string,    // Chat containing messages
    userId: string,    // User updating status
    status: 'seen' | 'receive'
  }
  ```
- **Response**: Status update confirmation

## User Endpoints

### Create User (Signup)
- **Route**: `POST /user/signup`
- **Body**: Webhook payload from Clerk
- **Response**: Created user object

### Delete User
- **Route**: `POST /user/delete`
- **Body**: Webhook payload for user deletion
- **Response**: Deletion confirmation

### Get User
- **Route**: `POST /user/get`
- **Body**:
  ```typescript
  {
    userId: string    // User to retrieve
  }
  ```
- **Response**: User details

### Get User Suggestions
- **Route**: `POST /user/suggestions`
- **Body**:
  ```typescript
  {
    identifier: string  // Username/email to search
  }
  ```
- **Response**: Array of matching users

## Friend Endpoints

### Create Friend
- **Route**: `POST /user/create-friend`
- **Body**:
  ```typescript
  {
    userId: string,    // User adding friend
    friendId: string   // User to add as friend
  }
  ```
- **Response**: Created friend relationship

### Get Friends
- **Route**: `POST /user/get-friends`
- **Body**:
  ```typescript
  {
    userId: string    // User whose friends to retrieve
  }
  ```
- **Response**: Array of friend relationships

### Delete Friend
- **Route**: `POST /user/delete-friend`
- **Body**:
  ```typescript
  {
    friendDocumentId: string  // Friend relationship to delete
  }
  ```
- **Response**: Deletion confirmation

## Response Format

All endpoints return responses in the following format:
```typescript
{
  statusCode: number,     // HTTP status code
  data: any,             // Response data
  message: string        // Success/error message
}
```

## Error Handling

Errors are returned in the following format:
```typescript
{
  statusCode: number,     // HTTP status code
  message: string,       // Error message
  stack?: string        // Stack trace (development only)
}
```

## Rate Limiting
- No rate limiting implemented currently
- Planned for future versions

## Versioning
Current API version: v1
