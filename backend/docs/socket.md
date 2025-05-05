# Socket.ts Documentation

## Overview

The `socket.ts` file implements real-time communication for the Chat-Hive application using Socket.IO. It manages user connections, chat rooms, and message broadcasting between users through a SocketManager class.

## Key Components

### SocketManager Class

The core of the real-time functionality is the `SocketManager` class which manages:
- Active user tracking and their socket connections
- Chat room participation 
- Message broadcasting
- User online/offline status
- Message seen/received status

### Data Structures
- `activeUsers`: Map<string, User> - Tracks online users with their socket info
- `chatRooms`: Map<string, Set<string>> - Manages chat room participants
- `onlineUsers`: Map<string, boolean> - Tracks user online status

## User Management

### Connection Flow
1. User connects via socket.io
2. User emits USER_CONNECTED event with their userId
3. Server adds user to activeUsers map
4. Server tracks user's online status

### Online/Offline Status
- Online status tracked via onlineUsers map
- Status changes broadcasted to relevant users
- Last seen time updated in database on status change

## Chat Room System

### Socket.IO Rooms
- Each chat gets a unique Socket.IO room
- Users join rooms via JOIN_CHAT event
- Messages broadcasted to specific rooms
- Efficient message delivery to relevant users

### Room Management
- Users automatically join relevant chat rooms
- Room cleanup on user disconnect
- Participant tracking per chat room

## Message Flow

### New Message Process
1. Client sends message via NEW_MESSAGE event
2. Server validates and broadcasts to room
3. Offline users handled via direct socket emission
4. Delivery confirmation sent back to sender

### Message Status Updates
- SEEN_AND_RECEIVE_MESSAGE for single message status
- SEEN_AND_RECEIVE_MESSAGES for bulk status updates
- Status changes broadcasted to message sender

## Event Handling

### Core Events
- USER_CONNECTED: New user connection
- JOIN_CHAT: User joins chat room
- NEW_MESSAGE: Message sending/receiving
- TYPING: Real-time typing indicators
- USER_ONLINE/USER_OFFLINE: Presence updates

### Status Events
- Message seen/received status
- Typing indicators
- Online/offline presence

## Disconnection Handling

When a user disconnects:
1. Remove from activeUsers map
2. Remove from all chat rooms
3. Update online status
4. Broadcast disconnect event
5. Clean up socket resources

## Implementation Details

### Error Handling
- Socket timeouts for operations
- Error logging via logger utility
- Fallback mechanisms for offline users

### Performance Optimization
- Efficient room-based broadcasting
- Map data structures for O(1) lookups
- Minimal database operations

## Best Practices

1. **Error Handling**: Comprehensive error checking before accessing properties
2. **Cleanup**: Proper cleanup of user data and rooms on disconnect
3. **Room Management**: Efficient use of Socket.IO rooms
4. **Data Consistency**: Synchronized activeUsers and chatRooms maps
5. **Logging**: Detailed logging for debugging and monitoring