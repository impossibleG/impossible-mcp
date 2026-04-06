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
});
