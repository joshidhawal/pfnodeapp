// Optional: Custom error class
class AppError extends Error {
  statusCode: number;
  errorDetails: object;
  logLabel?: string;
  constructor(
    message: string,
    statusCode = 500,
    errorDetails: object = { errorDescription: "An Error has occured" },
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Object.setPrototypeOf(this, AppError.prototype); // Keeps instanceof working
  }
}
export { AppError };
