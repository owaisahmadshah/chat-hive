# Socket.ts Documentation

## Overview

The `socket.ts` file implements real-time communication for the Chat-Hive application using Socket.IO. It manages user connections, chat rooms, and message broadcasting between users.

## Key Components

### SocketManager Class

The core of the real-time functionality is the `SocketManager` class, which:

- Tracks online users and their connection information
- Manages chat rooms and their participants
- Handles message broadcasting between users
- Processes user connection and disconnection events

## User Management

### Active Users Tracking

The system maintains a map of all connected users:

```typescript
private activeUsers: Map<string, User>
```

This map stores:
- **Key**: User ID (string)
- **Value**: User object containing:
  - `userId`: Unique identifier for the user
  - `socketId`: Socket.IO connection ID
  - `activeChat`: ID of the chat the user is currently viewing (or null)

### How Active Users Are Used

1. **User Lookup**: When a message needs to be sent to a specific user, their socket ID can be quickly retrieved
2. **Status Tracking**: The system can determine which users are online
3. **Active Chat Tracking**: The system knows which chat each user is currently viewing

## Chat Room System

### Socket.IO Rooms

The application uses Socket.IO's built-in room functionality to group connections. When a user joins a chat:

```typescript
socket.join(chatId)
```

This allows messages to be broadcast to all users in a specific chat using:

```typescript
socket.to(chatId).emit(EVENT_NAME, data)
```

### Custom Chat Room Tracking

In addition to Socket.IO rooms, the application maintains its own tracking of chat participants:

```typescript
private chatRooms: Map<string, Set<string>>
```

This map stores:
- **Key**: Chat ID (string)
- **Value**: Set of user IDs who are participants in this chat

### How Chat Rooms Are Used

1. **Participant Management**: Track which users belong to which chats
2. **Targeted Notifications**: Send notifications only to relevant users
3. **Cleanup**: When a user disconnects, they can be removed from all chat rooms

## Message Flow

1. A user sends a message to a specific chat
2. The server receives the message via the `NEW_MESSAGE` event
3. The server broadcasts the message to all users in that chat room (except the sender)
4. Recipients receive the message via their `NEW_MESSAGE` event handler

## Event Handling

The system handles several types of events:

### User Events
- `USER_CONNECTED`: When a user comes online
- `USER_DISCONNECTED`: When a user goes offline

### Chat Events
- `JOIN_CHAT`: When a user enters a chat
- `NEW_CHAT`: When a new chat is created
- `DELETE_CHAT`: When a chat is deleted

### Message Events
- `NEW_MESSAGE`: When a new message is sent
- `DELETE_MESSAGE`: When a message is deleted
- `TYPING`: When a user is typing

## Disconnection Handling

When a user disconnects:

1. They are removed from the `activeUsers` map
2. They are removed from all chat rooms they were part of
3. Other users are notified of the disconnection

## Implementation Details

### User Connection Process

1. User connects to the Socket.IO server
2. Client emits `USER_CONNECTED` with the user's ID
3. Server adds user to the `activeUsers` map
4. User is now ready to join chats and send/receive messages

### Joining a Chat

1. Client emits `JOIN_CHAT` with the chat ID
2. Server adds the user's socket to the Socket.IO room
3. Server updates the user's `activeChat` property
4. Server adds the user to the chat's participant list in `chatRooms`

### Sending a Message

1. Client emits `NEW_MESSAGE` with message data
2. Server creates a message object with timestamp
3. Server broadcasts the message to all users in the chat room (except sender)

## Best Practices

1. **Error Handling**: Always check if users exist before accessing their properties
2. **Cleanup**: Properly remove users from all tracking when they disconnect
3. **Room Management**: Use Socket.IO rooms for efficient broadcasting
4. **Data Consistency**: Keep the `activeUsers` and `chatRooms` maps in sync 