import { request as httpRequest } from "node:http";
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

  it("rejects MCP requests from hosts and origins outside the allowlist", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33436",
      MCP_LOG_LEVEL: "silent",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const rebound = await postMcp(33436, { host: "attacker.example:33436" });
    const crossOrigin = await postMcp(33436, {
      host: "127.0.0.1:33436",
      origin: "https://attacker.example",
    });
    const local = await postMcp(33436, {
      host: "localhost:33436",
      origin: "http://localhost:5173",
    });
    expect(rebound.status).toBe(403);
    expect(rebound.body).toContain("Invalid Host: attacker.example");
    expect(crossOrigin.status).toBe(403);
    expect(crossOrigin.body).toContain("Invalid Origin: attacker.example");
    expect(local.status).not.toBe(403);
  });

  it("accepts hosts added to the allowlist", async () => {
    const config = loadConfig({
      MCP_TRANSPORT: "http",
      MCP_PORT: "33437",
      MCP_LOG_LEVEL: "silent",
      MCP_ALLOWED_HOSTS: "mcp.example.com",
    });
    runtime = await startHttp(config, pino({ level: "silent" }));
    const allowed = await postMcp(33437, { host: "mcp.example.com" });
    const loopback = await postMcp(33437, { host: "127.0.0.1:33437" });
    expect(allowed.status).not.toBe(403);
    expect(loopback.status).toBe(403);
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

function postMcp(
  port: number,
  headers: Record<string, string>,
): Promise<{ status: number; body: string }> {
  const body = JSON.stringify({ jsonrpc: "2.0", id: 1, method: "ping" });
  return new Promise((resolve, reject) => {
    const request = httpRequest(
      {
        host: "127.0.0.1",
        port,
        path: "/mcp",
        method: "POST",
        headers: {
          ...headers,
          accept: "application/json, text/event-stream",
          "content-type": "application/json",
        },
      },
      (response) => {
        let text = "";
        response.setEncoding("utf8");
        response.on("data", (chunk: string) => {
          text += chunk;
        });
        response.on("end", () => {
          resolve({ status: response.statusCode ?? 0, body: text });
        });
      },
    );
    request.once("error", reject);
    request.end(body);
  });
}
