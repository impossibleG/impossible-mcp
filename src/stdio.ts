import { serveStdio, type StdioServerHandle } from "@modelcontextprotocol/server/stdio";
import type { Logger } from "pino";
import { buildServer } from "./server.js";

export function startStdio(logger: Logger): StdioServerHandle {
  logger.info("starting MCP server over stdio");
  return serveStdio(() => buildServer({ logger }));
}
