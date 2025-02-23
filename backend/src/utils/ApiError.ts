class ApiError extends Error {
  statusCode: number
  data: null = null
  success: false = false
  errors: any[]

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    errors: any[] = [],
    stack?: string
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors

    // Set the stack trace properly if provided
    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace?.(this, this.constructor)
    }
  }
}

export { ApiError }
