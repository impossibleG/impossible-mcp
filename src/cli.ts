#!/usr/bin/env node
import { Command } from "commander";
import { loadConfig } from "./config.js";
import { startHttp } from "./http.js";
import { installShutdownHandlers } from "./lifecycle.js";
import { createLogger } from "./logger.js";
import { startStdio } from "./stdio.js";
import { toError } from "./errors.js";

const program = new Command()
  .name("impossible-mcp")
  .description("Run the Impossible G MCP server template")
  .option("-t, --transport <transport>", "stdio or http")
  .option("--host <host>", "HTTP bind host")
  .option("-p, --port <port>", "HTTP port")
  .parse();

const options = program.opts<{ transport?: string; host?: string; port?: string }>();
const environment = {
  ...process.env,
  ...(options.transport ? { MCP_TRANSPORT: options.transport } : {}),
  ...(options.host ? { MCP_HOST: options.host } : {}),
  ...(options.port ? { MCP_PORT: options.port } : {}),
};

try {
  const config = loadConfig(environment);
  const logger = createLogger(config);
  if (config.transport === "stdio") {
    startStdio(logger);
  } else {
    const runtime = await startHttp(config, logger);
    installShutdownHandlers(runtime.close, logger);
  }
} catch (cause) {
  const error = toError(cause);
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
