# Chat Hive Database Schema

This document describes the MongoDB database schema used in the Chat Hive application, including collections, fields, indexes, and relationships.

## Collections Overview

The database consists of the following collections:

1. **users**: Stores user information
2. **chats**: Stores chat conversations
3. **messages**: Stores individual messages
4. **contacts**: Stores user contacts

## Schema Details

### Users Collection

Stores information about application users.

```javascript
{
  _id: ObjectId,              // Unique identifier
  name: String,               // User's full name
  email: String,              // User's email address (unique)
  profilePicture: String,     // URL to profile picture
  status: String,             // User status (online, offline, away)
  lastSeen: Date,             // Timestamp of last activity
  createdAt: Date,            // Account creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

**Indexes:**

- `email`: Unique index for fast lookups by email

### Chats Collection

Represents conversations between users.

```javascript
{
  _id: ObjectId,              // Unique identifier
  admin: ObjectId,            // User who created the chat (ref: users)
  users: [ObjectId],          // Array of users in the chat (ref: users)
  lastMessage: ObjectId,      // Reference to the last message (ref: messages)
  deletedBy: [ObjectId],      // Users who have deleted this chat (ref: users)
  createdAt: Date,            // Chat creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

**Indexes:**

- `admin`: Index for finding chats by admin
- `users`: Index for finding chats by participants
- Compound index on `users` and `deletedBy` for efficient chat retrieval

### Messages Collection

Stores individual messages within chats.

```javascript
{
  _id: ObjectId,              // Unique identifier
  sender: ObjectId,           // User who sent the message (ref: users)
  chatId: ObjectId,           // Chat this message belongs to (ref: chats)
  message: String,            // Text content of the message
  photoUrl: String,           // URL to attached image (if any)
  status: String,             // Message status (sent, received, seen)
  deletedBy: [ObjectId],      // Users who have deleted this message (ref: users)
  createdAt: Date,            // Message creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

**Indexes:**

- `chatId`: Index for finding messages by chat
- `sender`: Index for finding messages by sender
- Compound index on `chatId` and `createdAt` for efficient message retrieval

## Relationships

1. **User to Chats**: One-to-many relationship (a user can participate in multiple chats)
2. **Chat to Messages**: One-to-many relationship (a chat contains multiple messages)
3. **User to Messages**: One-to-many relationship (a user can send multiple messages)

## Data Integrity

The application maintains referential integrity through application logic. When implementing transactions, the following operations should be atomic:

1. Creating a message and updating the chat's lastMessage
2. Deleting a chat and marking all its messages as deleted for a user
3. User account deletion and cleaning up related data

## Schema Evolution

As the application evolves, the schema may need to change. Consider the following best practices:

1. Use schema versioning for major changes
2. Implement migration scripts for schema updates
3. Design for backward compatibility when possible

## Performance Considerations

1. Use appropriate indexes for frequent query patterns
2. Consider time-to-live (TTL) indexes for temporary data
3. Implement pagination for large collections (messages)
4. Use projection to limit fields returned in queries
