# Chat Hive API Documentation

This document provides detailed information about the Chat Hive API endpoints, request/response formats, and authentication requirements.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Most endpoints require authentication. Authentication is handled through Clerk, and the user ID should be included in the request body or as a parameter where specified.

## API Endpoints

### Health Check

#### GET /healthcheck
Checks if the API is running.

**Response:**
```json
{
  "status": 200,
  "message": "OK",
  "data": {
    "timestamp": "2023-03-01T12:00:00Z"
  }
}
```

### Chat Endpoints

#### POST /chat/create
Creates a new chat or returns an existing chat.

**Request Body:**
```json
{
  "admin": "user_id",
  "users": ["user_id1", "user_id2"]
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "chatId": "chat_id",
    "users": ["user_id1", "user_id2"]
  },
  "message": "Created new chat successfully"
}
```

#### POST /chat/delete
Marks a chat as deleted for a specific user.

**Request Body:**
```json
{
  "chatId": "chat_id",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {},
  "message": "Success"
}
```

#### POST /chat/get
Gets all chats and messages for a user.

**Request Body:**
```json
{
  "userId": "user_id"
}
```

**Response:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "chat_id",
      "admin": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "profilePicture": "url_to_profile_picture"
      },
      "chatUser": {
        "_id": "user_id",
        "name": "Chat User Name",
        "email": "chatuser@example.com",
        "profilePicture": "url_to_profile_picture"
      },
      "lastMessage": {
        "_id": "message_id",
        "message": "Hello!",
        "createdAt": "2023-03-01T12:00:00Z"
      },
      "messages": [
        {
          "_id": "message_id",
          "sender": {
            "_id": "user_id",
            "name": "User Name"
          },
          "message": "Hello!",
          "photoUrl": "",
          "status": "seen",
          "createdAt": "2023-03-01T12:00:00Z"
        }
      ],
      "createdAt": "2023-03-01T12:00:00Z",
      "updatedAt": "2023-03-01T12:00:00Z"
    }
  ],
  "message": "Success"
}
```

### Message Endpoints

#### POST /message/create
Creates a new message.

**Request Body:**
```json
{
  "sender": "user_id",
  "chatId": "chat_id",
  "message": "Hello!",
  "status": "sent"
}
```

**Request File Upload:**
- Field name: `uploadedImage`
- File type: Image (JPEG, PNG)

**Response:**
```json
{
  "statusCode": 201,
  "data": {
    "newMessage": {
      "_id": "message_id",
      "sender": "user_id",
      "chatId": "chat_id",
      "message": "Hello!",
      "photoUrl": "url_to_image",
      "status": "sent",
      "createdAt": "2023-03-01T12:00:00Z",
      "updatedAt": "2023-03-01T12:00:00Z"
    }
  },
  "message": "Created message"
}
```

#### POST /message/delete
Marks a message as deleted for a specific user.

**Request Body:**
```json
{
  "messageId": "message_id",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "data": {},
  "message": "Deleted Message successfully"
}
```

## Error Responses

All endpoints return standardized error responses:

```json
{
  "statusCode": 400,
  "data": {},
  "message": "Error message describing what went wrong"
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Versioning

The current API version is v1. The version is included in the URL path. 