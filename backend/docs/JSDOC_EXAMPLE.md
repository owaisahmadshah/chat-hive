# JSDoc Style Guide for Chat Hive

This document outlines the JSDoc style to use throughout the Chat Hive codebase, matching the style already used in our controllers.

## Controller Functions

For controller functions, use this format:

```typescript
/**
 * @desc    Brief description of what the function does.
 * @route   HTTP_METHOD /api/v1/path/to/endpoint
 * @access  Private|Public
 *
 * @param {Request} req - Express request object containing relevant details
 * @param {Response} res - Express response object
 */
const functionName = asyncHandler(async (req: Request, res: Response) => {
  // Implementation
});
```

Example:

```typescript
/**
 * @desc    Create a new chat if it doesn't exist or return the existing chat.
 *          If the chat exists but has a different admin, update the admin.
 * @route   POST /api/v1/chat/create
 * @access  Private
 *
 * @param {Request} req - Express request object containing chat details (admin, users)
 * @param {Response} res - Express response object to return chat details
 */
const createChat = asyncHandler(async (req: Request, res: Response) => {
  // Implementation
});
```

## Models

For model interfaces and schemas, use this format:

```typescript
/**
 * @desc    Brief description of the model.
 */
interface modelDocument extends Document {
  // Properties
}

/**
 * @desc    Brief description of the schema.
 */
const modelSchema = new Schema<modelDocument>(
  {
    // Schema definition
  },
  {
    timestamps: true,
  }
);
```

Example:

```typescript
/**
 * @desc    User document interface for authentication and profile data.
 */
interface userDocument extends Document {
  username: string;
  email: string;
  password: string;
  imageUrl: string;
  isSignedIn: boolean;
  about: string;
  showAbout: string;
  showLastSeen: string;
  showProfileImage: string;
  isReadReceipts: boolean;
  refreshToken: string;
  otp: string;
  otpExpiry: Date;
  isVerified: boolean;
}

/**
 * @desc    Schema for user data including authentication and profile information.
 */
const userSchema = new mongoose.Schema<userDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Other fields...
  },
  {
    timestamps: true,
  }
);
```

## Utility Classes and Functions

For utility classes and functions, use this format:

```typescript
/**
 * @desc    Brief description of the utility.
 * @param   {Type} paramName - Description of the parameter
 * @returns {Type} Description of the return value
 */
```

Example:

```typescript
/**
 * @desc    Uploads a file to Cloudinary cloud storage.
 * @param   {string} localFilePath - Path to the local file to upload
 * @returns {Promise<object|null>} Cloudinary response or null if upload fails
 */
const uploadOnCloudinary = async (localFilePath: string) => {
  // Implementation
};
```

## Error Classes

For error classes, use this format:

```typescript
/**
 * @desc    Brief description of the error class.
 */
class ErrorClassName extends Error {
  // Properties and methods
}
```

Example:

```typescript
/**
 * @desc    Custom API error class for standardized error responses.
 */
class ApiError extends Error {
  // Properties and constructor
}
```

## Middleware Functions

For middleware functions, use this format:

```typescript
/**
 * @desc    Brief description of what the middleware does.
 * @param   {Request} req - Express request object
 * @param   {Response} res - Express response object
 * @param   {NextFunction} next - Express next function
 */
const middlewareName = (req: Request, res: Response, next: NextFunction) => {
  // Implementation
};
```

## Generating Documentation

To generate HTML documentation from these JSDoc comments:

1. Install JSDoc:
   ```bash
   npm install --save-dev jsdoc
   ```

2. Create a jsdoc.json configuration file:
   ```json
   {
     "source": {
       "include": ["src"],
       "includePattern": ".+\\.ts$"
     },
     "plugins": ["node_modules/jsdoc-typescript"],
     "opts": {
       "destination": "./docs/",
       "recurse": true
     }
   }
   ```

3. Add a script to package.json:
   ```json
   "scripts": {
     "docs": "jsdoc -c jsdoc.json"
   }
   ```

4. Run the documentation generator:
   ```bash
   npm run docs
   ``` 