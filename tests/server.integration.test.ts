import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import pino from "pino";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildServer } from "../src/server.js";

describe("MCP capabilities", () => {
  const logger = pino({ level: "silent" });
  const now = new Date("2026-09-22T12:00:00.000Z");
  let server: ReturnType<typeof buildServer>;
  let client: Client;

  beforeEach(async () => {
    server = buildServer({ logger, now: () => now });
    client = new Client({ name: "integration-test", version: "1.0.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);
  });

  afterEach(async () => {
    await client.close();
    await server.close();
  });

  it("lists the template's tools", async () => {
    const result = await client.listTools();
    expect(result.tools.map((tool) => tool.name)).toEqual(["echo", "server-time"]);
  });

  it("validates and calls the echo tool", async () => {
    const result = await client.callTool({
      name: "echo",
      arguments: { text: "hello", prefix: "Result: " },
    });
    expect(result.content).toContainEqual({ type: "text", text: "Result: hello" });
  });

  it("returns deterministic server time", async () => {
    const result = await client.callTool({ name: "server-time", arguments: {} });
    expect(result.content).toContainEqual({ type: "text", text: now.toISOString() });
  });

  it("reads static and templated resources", async () => {
    const about = await client.readResource({ uri: "impossible://about" });
    const greeting = await client.readResource({ uri: "impossible://greetings/Ada" });
    expect(about.contents[0]).toMatchObject({ mimeType: "text/markdown" });
    expect(greeting.contents[0]).toMatchObject({ text: "Hello, Ada." });
  });

  it("renders prompt arguments", async () => {
    const prompt = await client.getPrompt({
      name: "review-tool-result",
      arguments: { result: "42", goal: "Find the answer" },
    });
    expect(prompt.messages[0]?.content).toMatchObject({ type: "text" });
    expect(JSON.stringify(prompt)).toContain("Find the answer");
  });
});
