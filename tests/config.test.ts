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
    });
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
