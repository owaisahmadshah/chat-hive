# Chat Hive Code Architecture

This document provides an overview of the Chat Hive application architecture, explaining the key components, their relationships, and the design patterns used.

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── models/         # Database schemas
│   ├── routes/         # API routes
│   ├── utils/         # Utility functions
│   ├── middlewares/    # Express middlewares
│   ├── services/      # Business logic and services
│   ├── db/           # Database configuration
│   ├── app.ts        # Express app configuration
│   └── index.ts      # Application entry point
├── docs/            # Documentation
└── package.json     # Dependencies and scripts
```

## Architecture Overview

Chat Hive follows a layered architecture pattern with clear separation of concerns:

- **Models**: Define the data structure and database interactions (MongoDB schemas)
- **Controllers**: Handle request processing and business logic
- **Routes**: Define API endpoints and handle authentication
- **Services**: Implement core business logic (e.g., Socket.IO handling)
- **Utils**: Shared utilities for error handling, responses, and logging

## Key Components

### Models

The application uses Mongoose schemas to define the data structure:

1. **User Model**: Represents application users with authentication details
2. **Chat Model**: Represents a conversation between users
3. **Message Model**: Represents individual messages within a chat

### Controllers

Controllers handle the business logic:

1. **Chat Controller**: Manages chat creation, deletion, and retrieval
2. **Message Controller**: Handles message creation and deletion
3. **Health Check Controller**: Provides API status information
4. **User Controller**: Manages user-related work.

### Utilities

1. **ApiResponse**: Standardizes API responses
2. **AsyncHandler**: Wraps async functions to handle errors
3. **Cloudinary**: Manages image uploads

## Real-time Communication

The real-time communication is implemented using Socket.IO with the following features:

1. **Connection Management**
   - User authentication and connection tracking
   - Online/offline status management
   - Connection cleanup on disconnects

2. **Chat Features**
   - Real-time message delivery
   - Typing indicators
   - Message seen/received status
   - User presence tracking

3. **Performance Optimizations**
   - Efficient room-based broadcasting
   - Map-based data structures for O(1) lookups
   - Minimal database operations

## Authentication Flow

1. **User Registration**
   - Email verification via OTP
   - Password validation and hashing
   - User profile creation

2. **User Login**
   - Username/email authentication
   - JWT token generation
   - Session management

3. **Authorization**
   - Protected route middleware
   - Token verification
   - Role-based access control

## Error Handling

1. **Global Error Handler**
   - Centralized error processing
   - Standardized error responses
   - Error logging and monitoring

2. **Custom Error Classes**
   - ApiError for HTTP errors
   - Validation errors
   - Authentication errors

## API Design

1. **RESTful Endpoints**
   - Resource-based routing
   - Standard HTTP methods
   - Consistent response format

2. **Response Format**
   - Standard success/error structure
   - Pagination support
   - Error details and codes

## Database Design

1. **MongoDB Collections**
   - Users: User profiles and auth
   - Chats: Chat room information
   - Messages: Chat messages
   - Friends: User relationships

2. **Relationships**
   - Referenced documents
   - Efficient querying
   - Data consistency

## Future Improvements

1. **Scalability**
   - Horizontal scaling of Socket.IO
   - Message queue implementation
   - Caching layer addition

2. **Features**
   - Group chat support
   - Media sharing optimization
   - Message search functionality
   - End-to-end encryption

3. **Performance**
   - Rate limiting implementation
   - Connection pooling
   - Query optimization
