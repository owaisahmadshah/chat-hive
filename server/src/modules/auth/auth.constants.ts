import { CookieOptions } from 'express';

export const REFRESH_TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 14 * 24 * 60 * 60 * 1000,
};

export const ACCESS_TOKEN_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  maxAge: 10 * 60 * 1000,
};
