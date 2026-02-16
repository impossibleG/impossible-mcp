import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler, type NodeIncomingMessageLike } from "@modelcontextprotocol/node";
import type { Logger } from "pino";
import type { AppConfig } from "./config.js";
import { buildServer } from "./server.js";

export type HttpRuntime = { server: Server; close: () => Promise<void> };

export async function startHttp(config: AppConfig, logger: Logger): Promise<HttpRuntime> {
  const mcpHandler = createMcpHandler(() => buildServer({ logger }), {
    responseMode: config.httpJsonResponse ? "json" : "sse",
  });
  const nodeHandler = toNodeHandler(mcpHandler);

  const server = createServer((request, response) => {
    void handleRequest(request, response);
  });

  async function handleRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
    if (request.method === "GET" && url.pathname === "/healthz") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok" }));
      return;
    }
    if (request.method === "GET" && url.pathname === "/readyz") {
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ready" }));
      return;
    }
    if (url.pathname !== config.path) {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "not_found" }));
      return;
    }
    if (!request.method) {
      response.writeHead(400, { "content-type": "application/json" });
      response.end(JSON.stringify({ error: "missing_method" }));
      return;
    }
    await nodeHandler(request as unknown as NodeIncomingMessageLike, response);
  }

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(config.port, config.host, () => {
      resolve();
    });
  });
  logger.info(
    { host: config.host, port: config.port, path: config.path },
    "MCP HTTP server listening",
  );

  return {
    server,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      }),
  };
}
