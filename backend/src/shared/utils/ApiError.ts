class ApiError extends Error {
  statusCode: number
  data: any
  success: boolean
  errors: any[]

  /**
   * @desc    Creates a new API error instance
   * @param   {number} statusCode - HTTP status code for the error
   * @param   {string} message - Error message describing what went wrong
   * @param   {any[]} [errors=[]] - Array of specific error details
   * @param   {string} [stack=""] - Error stack trace
   */
  constructor(
    statusCode: number,
    message = "Something went wrong",
    errors: any[] = [],
    stack = ""
  ) {
    super(message)
    this.statusCode = statusCode
    this.data = null
    this.message = message
    this.success = false
    this.errors = errors

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export { ApiError }
