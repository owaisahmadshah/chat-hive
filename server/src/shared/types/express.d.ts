import { ReqUser } from 'shared';

declare module 'express' {
  interface Request {
    user?: ReqUser;
  }
}

export {};
