import { describe, expect, it } from "vitest";
import { loadConfig } from "../src/config.js";

describe("loadConfig", () => {
  it("returns safe local defaults", () => {
    expect(loadConfig({})).toEqual({
      transport: "stdio",
      host: "127.0.0.1",
      port: 3333,
      path: "/mcp",
      logLevel: "info",
      httpJsonResponse: false,
      allowedHosts: ["localhost", "127.0.0.1", "[::1]"],
      allowedOrigins: ["localhost", "127.0.0.1", "[::1]"],
    });
  });

  it("parses comma-separated host and origin allowlists", () => {
    expect(
      loadConfig({ MCP_ALLOWED_HOSTS: "mcp.example.com, localhost", MCP_ALLOWED_ORIGINS: "" }),
    ).toMatchObject({ allowedHosts: ["mcp.example.com", "localhost"], allowedOrigins: [] });
  });

  it("accepts HTTP configuration", () => {
    expect(
      loadConfig({ MCP_TRANSPORT: "http", MCP_PORT: "4400", MCP_HTTP_JSON_RESPONSE: "true" }),
    ).toMatchObject({ transport: "http", port: 4400, httpJsonResponse: true });
  });

  it("rejects invalid ports", () => {
    expect(() => loadConfig({ MCP_PORT: "70000" })).toThrow("Invalid configuration");
  });
});
