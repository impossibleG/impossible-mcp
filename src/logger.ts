import pino, { type Logger } from "pino";
import type { AppConfig } from "./config.js";

export function createLogger(config: Pick<AppConfig, "logLevel" | "transport">): Logger {
  return pino(
    {
      level: config.logLevel,
      base: null,
      redact: {
        paths: ["authorization", "headers.authorization", "*.apiKey", "*.token", "*.secret"],
        censor: "[redacted]",
      },
    },
    config.transport === "stdio" ? pino.destination(2) : pino.destination(1),
  );
}
