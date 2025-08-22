# API Documentation

## Base URL
`/api/v1`

## Authentication
Most endpoints require authentication via JWT token. Include the Bearer token in the Authorization header. Some endpoints are public and don't require authentication.

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
- **Route**: `DELETE /chat/delete`
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
- **Access**: Private
- **Body**: FormData with:
  ```typescript
  {
    chatId: string,        // Target chat
    message: string,       // Message content
    sender: string,        // Sender ID
    uploadedImage?: File[] // Optional image files (up to 15)
  }
  ```
- **Response**: Created message object

### Delete Message
- **Route**: `DELETE /message/delete`
- **Access**: Private
- **Body**:
  ```typescript
  {
    messageId: string,  // Message to delete
    userId: string     // User requesting deletion
  }
  ```
- **Response**: Deletion confirmation

### Update Messages Status
- **Route**: `POST /message/updatestatus`
- **Access**: Private
- **Body**:
  ```typescript
  {
    chatId: string,    // Chat containing messages
    userId: string,    // User updating status
    status: 'seen' | 'receive'
  }
  ```
- **Response**: Status update confirmation

### Update Single Message Status
- **Route**: `POST /message/updateonestatus`
- **Access**: Private
- **Body**:
  ```typescript
  {
    messageId: string,  // Message to update
    status: 'seen' | 'receive'
  }
  ```
- **Response**: Status update confirmation

## User Endpoints

### Public Endpoints

### Create User (Signup)
- **Route**: `POST /user/signup`
- **Access**: Public
- **Response**: Created user object

### Sign In
- **Route**: `POST /user/sign-in`
- **Access**: Public
- **Response**: Authentication tokens and user details

### Verify OTP
- **Route**: `POST /user/verify-otp`
- **Access**: Public
- **Response**: Password update confirmation

### Resend OTP
- **Route**: `POST /user/resend-otp`
- **Access**: Public
- **Response**: OTP resend confirmation

### Refresh Token
- **Route**: `POST /user/refresh-token`
- **Access**: Public
- **Response**: New access token

### Check Username Uniqueness
- **Route**: `GET /user/unique-username`
- **Access**: Public
- **Response**: Username availability status

### Protected Endpoints

### Delete User
- **Route**: `DELETE /user/delete`
- **Access**: Private
- **Response**: Deletion confirmation

### Change Password
- **Route**: `POST /user/change-password`
- **Access**: Private
- **Response**: Password change confirmation

### Get User
- **Route**: `POST /user/user`
- **Body**:
  ```typescript
  {
    userId: string    // User to retrieve
  }
  ```
- **Access**: Private
- **Response**: User details

### Update User Show Status
- **Route**: `POST /user/update-user-fields`
- **Access**: Private
- **Response**: Updated user status

### Update Profile Image
- **Route**: `POST /user/update-profile-image`
- **Access**: Private
- **Body**: FormData with profile image
- **Response**: Updated user profile

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
- **Route**: `DELETE /user/delete-friend`
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

## Health Check Endpoint

### Check API Health
- **Route**: `GET /healthcheck`
- **Access**: Public
- **Description**: Returns the health status of the API
- **Response**: Health status confirmation

## Rate Limiting
- No rate limiting implemented currently
- Planned for future versions

## Versioning
Current API version: v1
