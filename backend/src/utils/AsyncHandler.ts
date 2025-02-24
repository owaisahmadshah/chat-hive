import type { Request, Response, NextFunction, RequestHandler } from "express"

/**
 * Async handler to catch errors and pass them to Express error handler.
 * Supports functions that return Promise<Response> without TypeScript issues.
 */
const asyncHandler =
  <T = any>(
    requestHandler: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<T>
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch(next)
  }

export { asyncHandler }
