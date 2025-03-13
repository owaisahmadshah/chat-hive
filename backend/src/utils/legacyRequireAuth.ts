import type { Request, Response, NextFunction } from "express"

const legacyRequireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.auth.userId) {
    return next(new Error("Unauthenticated"))
  }
  next()
}

// https://clerk.com/docs/upgrade-guides/node-to-express#migrate-from-clerk-express-require-auth
export { legacyRequireAuth }
