import pino, { Logger } from "pino";

export class AppLogger {
  private static instance: Logger;

  /** Initialize only once (Singleton) */
  private static createLogger(): Logger {
    if (!this.instance) {
      this.instance = pino({
        level: process.env.LOG_LEVEL || "info",
        transport: {
          targets: [
            {
              target: "pino-pretty", // Pretty console for development
              options: {
                colorize: true,
                translateTime: "SYS:standard",
              },
              level: "trace",
            },
            {
              target: "pino/file", // Main app log
              options: { destination: "logs/app.log", mkdir: true },
              level: "info",
            },
            {
              target: "pino/file", // Errors only
              options: { destination: "logs/error.log", mkdir: true },
              level: "error",
            },
          ],
        },
      });
    }
    return this.instance;
  }

  /** Get the root logger instance */
  static getLogger(): Logger {
    return this.createLogger();
  }

  /** Get a child logger for a specific service/class */
  static getChildLogger(value: string = "LoggerService"): Logger {
    return this.getLogger().child({ logLabel: value });
  }
}
