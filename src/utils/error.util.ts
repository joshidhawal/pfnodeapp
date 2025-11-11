// Optional: Custom error class
class AppError extends Error {
  statusCode: number;
  errorDetails: any;
  logLabel?: string;
  constructor(
    message: string,
    statusCode = 500,
    errorDetails: any = { errorDescription: "An Error has occured" }
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorDetails = errorDetails;
    Object.setPrototypeOf(this, AppError.prototype); // Keeps instanceof working
  }
}
export { AppError };
