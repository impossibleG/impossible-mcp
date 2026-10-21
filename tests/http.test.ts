import { connect } from "node:net";
import { afterEach, describe, expect, it } from "vitest";
import pino from "pino";
import { startHttp, type HttpRuntime } from "../src/http.js";
import { loadConfig } from "../src/config.js";

describe("HTTP runtime", () => {
  let runtime: HttpRuntime | undefined;
  afterEach(async () => runtime?.close());

  it("reports health and readiness", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33431",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const health = await fetch("http://127.0.0.1:33431/healthz");
    const ready = await fetch("http://127.0.0.1:33431/readyz");
    expect(health.status).toBe(200);
    await expect(health.json()).resolves.toEqual({ status: "ok" });
    expect(ready.status).toBe(200);
  });

  it("returns JSON for unknown routes", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33432",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const response = await fetch("http://127.0.0.1:33432/nope");
    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: "not_found" });
  });

  it("keeps serving after a request with a malformed Host header", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33433",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const status = await rawRequest(33433, "GET /healthz HTTP/1.1\r\nHost: a b\r\n\r\n");
    expect(status).toBe("HTTP/1.1 200 OK");
    const health = await fetch("http://127.0.0.1:33433/healthz");
    expect(health.status).toBe(200);
  });

  it("rejects an unparseable request target", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33434",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const status = await rawRequest(33434, "GET http://[ HTTP/1.1\r\nHost: localhost\r\n\r\n");
    expect(status).toBe("HTTP/1.1 400 Bad Request");
    const health = await fetch("http://127.0.0.1:33434/healthz");
    expect(health.status).toBe(200);
  });
});

function rawRequest(port: number, payload: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const socket = connect(port, "127.0.0.1", () => socket.write(payload));
    socket.once("data", (chunk) => {
      resolve(chunk.toString("latin1").split("\r\n")[0] ?? "");
      socket.destroy();
    });
    socket.once("error", reject);
  });
}
