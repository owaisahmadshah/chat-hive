import { JWTPayload } from './jwt-payload.type';

declare module 'express' {
  interface Request {
    user?: JWTPayload;
  }
}

export {};
