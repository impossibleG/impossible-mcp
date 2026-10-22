import { afterEach, describe, expect, it, vi } from "vitest";
import pino from "pino";
import { startHttp, type HttpRuntime } from "../src/http.js";
import { loadConfig } from "../src/config.js";

vi.mock("@modelcontextprotocol/node", () => ({
  toNodeHandler: () => () => Promise.reject(new Error("handler failed")),
}));

describe("HTTP runtime failures", () => {
  let runtime: HttpRuntime | undefined;
  afterEach(async () => runtime?.close());

  it("answers 500 and keeps serving when a request handler throws", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33435",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const failed = await fetch("http://127.0.0.1:33435/mcp", { method: "POST", body: "{}" });
    expect(failed.status).toBe(500);
    await expect(failed.json()).resolves.toEqual({ error: "internal_error" });
    const health = await fetch("http://127.0.0.1:33435/healthz");
    expect(health.status).toBe(200);
  });
});
