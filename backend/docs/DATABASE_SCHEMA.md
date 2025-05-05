# Database Schema Documentation

## Collections Overview

The application uses MongoDB with the following main collections:
- Users: Stores user profile and authentication information
- Chats: Stores chat room information and metadata
- Messages: Stores individual messages
- Friends: Stores user relationships and friend lists

## Schema Details

### Users Collection
```typescript
{
  _id: ObjectId,
  clerkId: string,        // External auth provider ID
  username: string,       // User's display name
  email: string,         // User's email address
  imageUrl: string,      // Profile picture URL
  lastSeen: Date,        // Last activity timestamp
  createdAt: Date,       // Account creation date
  updatedAt: Date        // Last profile update
}
```

### Chats Collection
```typescript
{
  _id: ObjectId,
  admin: ObjectId,        // User who created the chat
  users: [ObjectId],      // Array of participating users
  lastMessage: ObjectId,  // Reference to last message
  deletedBy: [ObjectId],  // Users who deleted this chat
  createdAt: Date,
  updatedAt: Date
}
```

### Messages Collection
```typescript
{
  _id: ObjectId,
  chatId: ObjectId,       // Reference to parent chat
  sender: ObjectId,       // User who sent the message
  message: string,        // Message content
  isPhoto: boolean,       // Whether message is an image
  status: string,         // sent/received/seen
  deletedBy: [ObjectId],  // Users who deleted this message
  createdAt: Date,
  updatedAt: Date
}
```

### Friends Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,       // User who added the friend
  friendId: ObjectId,     // The added friend
  createdAt: Date,
  updatedAt: Date
}
```

## Relationships

### One-to-Many
- User -> Messages (One user can send many messages)
- Chat -> Messages (One chat contains many messages)
- User -> Chats (One user can be in many chats)

### Many-to-Many
- Users <-> Chats (Users can be in multiple chats, chats can have multiple users)
- Users <-> Friends (Users can have multiple friends, users can be friends of multiple users)

## Data Integrity

1. **Referential Integrity**
   - Message deletion cascades to chat lastMessage updates
   - User deletion cascades to messages and chats
   - Chat deletion cascades to messages

2. **Soft Deletion**
   - Messages and chats use deletedBy arrays
   - Allows per-user deletion without affecting others
   - Maintains chat history for other participants

3. **Timestamps**
   - All collections include createdAt/updatedAt
   - Automatic updates via Mongoose middleware
   - Enables activity tracking and sorting

## Schema Evolution

1. **Current Version: 1.0**
   - Basic chat functionality
   - One-on-one conversations
   - Text and image messages

2. **Planned Extensions**
   - Group chat support
   - Message reactions
   - Message threading
   - Rich media support

## Performance Considerations

1. **Indexes**
```typescript
// Users Collection
- clerkId: 1 (unique)
- email: 1 (unique)
- username: 1

// Chats Collection
- users: 1
- admin: 1
- updatedAt: -1

// Messages Collection
- chatId: 1
- sender: 1
- createdAt: 1

// Friends Collection
- userId: 1
- friendId: 1
```

2. **Query Optimization**
   - Compound indexes for common queries
   - Projection to limit field retrieval
   - Pagination for message history

3. **Data Access Patterns**
   - Recent messages first
   - Chat list by last activity
   - Online user status tracking
