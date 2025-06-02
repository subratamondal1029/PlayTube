class ApiError extends Error {
  constructor(
    status,
    message = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.status = status;
    this.message = message;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
      success: this.success,
      errors: this.errors,
    };
  }
}

export default ApiError;
