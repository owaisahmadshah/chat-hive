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
  "admin": "",
  "users": ["", ""]
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "chat": {
      "admin": {
        "_id": "",
        "email": "",
        "imageUrl": "",
        "lastSeen": ""
      },
      "users": [
        {
          "_id": "",
          "email": "",
          "imageUrl": "",
          "lastSeen": ""
        }
      ],
      "updatedAt": ""
    }
  },
  "message": "Created new chat successfully"
}
```

#### POST /chat/delete

Marks a chat as deleted for a specific user.

**Request Body:**

```json
{
  "chatId": "",
  "userId": ""
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
  "userId": ""
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": [
    {
      "_id": "",
      "admin": {
        "_id": "",
        "email": "",
        "imageUrl": "",
        "lastSeen": ""
      },
      "chatUser": {
        "_id": "",
        "email": "",
        "imageUrl": "",
        "lastSeen": ""
      },
      "messages": [
        {
          "_id": "",
          "sender": {
            "_id": "",
            "email": "",
            "imageUrl": ""
          },
          "chatId": "",
          "message": "",
          "photoUrl": "",
          "status": "",
          "updatedAt": ""
        }
      ],
      "lastMessage": {
        "isPhoto": "",
        "message": ""
      },
      "updatedAt": "",
      "unreadMessages": "",
      "numberOfMessages": ""
    }
  ],
  "message": "Success"
}
```

#### POST /chat/getupdatechat

Update a chat.

**Request Body:**

```json
{
  "chatId": ""
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "chat": {
      "_id": "",
      "users": [
        {
          "_id": "",
          "email": "",
          "lastSeen": ""
        }
      ],
      "lastMessage": {
        "isPhoto": "",
        "message": ""
      },
      "unreadMessages": "",
      "updatedAt": ""
    }
  },
  "message": "Successful"
}
```

#### POST /chat/messsages

Gives 30 older messages of a specific chat.

**Request Body:**

```json
{
  "chatId": "",
  "userId": "",
  "userChatMessages": ""
}
```

**Response:**

```json
{
  "statusCode": 200,
  "data": {
    "messages": [
      {
        "_id": "",
        "sender": {
          "_id": "",
          "email": "",
          "imageUrl": ""
        },
        "chatId": "",
        "message": "",
        "photoUrl": "",
        "status": "",
        "updatedAt": ""
      }
    ]
  },
  "message": "Success"
}
```

### Message Endpoints

#### POST /message/create

Creates a new message.

**Request Body:**

```json
{
  "sender": "",
  "chatId": "",
  "message": "",
  "status": ""
}
```

**Request File Upload:**

- Field name: `uploadedImage`
- File type: Image (JPEG, PNG, etc.)

**Response:**

```json
{
  "statusCode": 201,
  "data": {
    "newMessage": {
      "_id": "",
      "sender": {
        "_id": "",
        "email": "",
        "imageUrl": ""
      },
      "chatId": "",
      "message": "",
      "photoUrl": "",
      "status": "",
      "updatedAt": ""
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
  "messageId": "",
  "userId": ""
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

#### POST /message/updatestatus

Marks a bulk of messages as received or seen.

**Request Body:**

```json
{
  "messageId": "",
  "userId": "",
  "status": ""
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {},
  "message": "Updated messages successfully"
}
```

#### POST /message/updateonestatus

Marks a message as received or seen.

**Request Body:**

```json
{
  "userId": "",
  "messageId": "",
  "status": ""
}
```

**Response:**

```json
{
  "statusCode": 201,
  "data": {},
  "message": "Updated message successfully"
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

- 200: Successful
- 202: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Rate Limiting

API requests are limited to 100 requests per minute per IP address.

## Versioning

The current API version is v1. The version is included in the URL path.
