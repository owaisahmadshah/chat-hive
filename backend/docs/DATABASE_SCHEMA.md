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
  username: string,       // User's unique username
  email: string,         // User's email address
  imageUrl: string,      // Profile picture URL (default: "./default-profile-picture.jpg")
  isSignedIn: boolean,   // User's current sign-in status
  about: string,         // User's about text (default: "Hey there!")
  showAbout: string,     // Privacy setting for about ("contacts"|"public"|"private")
  showLastSeen: string,  // Privacy setting for last seen ("contacts"|"public"|"private")
  showProfileImage: string, // Privacy setting for profile image ("contacts"|"public"|"private")
  isReadReceipts: boolean, // Whether read receipts are enabled
  refreshToken: string,  // JWT refresh token
  otp: string,          // One-time password for verification
  otpExpiry: Date,      // OTP expiration timestamp
  isVerified: boolean,  // Account verification status
  password: string,     // Hashed password
  createdAt: Date,      // Account creation date
  updatedAt: Date       // Last profile update
}
```

### Chats Collection
```typescript
{
  _id: ObjectId,
  admin: ObjectId,        // User who created the chat
  users: [ObjectId],      // Array of participating users
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
  message: string,        // Text message content (optional)
  photoUrl: string,       // URL of the attached photo (default: "")
  status: string,         // Message status (sent/receive/seen)
  deletedBy: [ObjectId],  // Users who deleted this message
  createdAt: Date,
  updatedAt: Date
}
```

### Friends Collection
```typescript
{
  _id: ObjectId,
  user: ObjectId,         // User who added the friend
  friend: ObjectId,       // The added friend
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

1. **Current Version: 2.0**
   - Enhanced user profiles with privacy settings
   - JWT-based authentication
   - OTP verification system
   - One-on-one conversations
   - Text and image messages
   - Read receipts
   - Last seen status
   - User about section
   - Profile image support

2. **Planned Extensions**
   - Group chat support
   - Message reactions
   - Message threading
   - Voice messages
   - Video calls

## Performance Considerations

1. **Indexes**
```typescript
// Users Collection
- email: 1 (unique)
- username: 1 (unique)

// Chats Collection
- admin: 1

// Messages Collection
- sender: 1
- chatId: 1

// Friends Collection
- user: 1
- friend: 1
```

2. **Query Optimization**
   - Compound indexes for common queries
   - Projection to limit field retrieval
   - Pagination for message history

3. **Data Access Patterns**
   - Recent messages first
   - Chat list by last activity
   - Online user status tracking
