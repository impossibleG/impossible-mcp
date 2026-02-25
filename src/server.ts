import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { Logger } from "pino";

export type ServerDependencies = {
  logger: Logger;
  now?: () => Date;
};

export function buildServer({ logger, now = () => new Date() }: ServerDependencies): McpServer {
  const server = new McpServer(
    { name: "impossible-mcp-template", version: "0.1.0" },
    { capabilities: { logging: {} } },
  );

  server.registerTool(
    "echo",
    {
      title: "Echo text",
      description: "Return text to the caller with an optional prefix.",
      inputSchema: z.object({
        text: z.string().min(1).max(10_000),
        prefix: z.string().max(100).optional(),
      }),
    },
    ({ text, prefix }) => {
      logger.debug({ tool: "echo", length: text.length }, "tool called");
      return { content: [{ type: "text", text: prefix ? `${prefix}${text}` : text }] };
    },
  );

  server.registerTool(
    "server-time",
    {
      title: "Read server time",
      description: "Return the server's current time as an ISO-8601 value.",
      inputSchema: z.object({}),
    },
    () => ({ content: [{ type: "text", text: now().toISOString() }] }),
  );

  server.registerResource(
    "about",
    "impossible://about",
    {
      title: "About this server",
      description: "Server identity and customization guidance",
      mimeType: "text/markdown",
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "text/markdown",
          text: "# Impossible MCP Template\n\nReplace the example capabilities in `src/server.ts` with your own.",
        },
      ],
    }),
  );

  server.registerResource(
    "greeting",
    new ResourceTemplate("impossible://greetings/{name}", { list: undefined }),
    {
      title: "Personal greeting",
      description: "A parameterized resource example",
      mimeType: "text/plain",
    },
    (uri, { name }) => ({
      contents: [{ uri: uri.href, mimeType: "text/plain", text: `Hello, ${String(name)}.` }],
    }),
  );

  server.registerPrompt(
    "review-tool-result",
    {
      title: "Review a tool result",
      description: "Ask a model to assess a tool result for correctness and gaps.",
      argsSchema: z.object({ result: z.string().min(1), goal: z.string().min(1) }),
    },
    ({ result, goal }) => ({
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Goal:\n${goal}\n\nTool result:\n${result}\n\nAssess correctness and identify missing information.`,
          },
        },
      ],
    }),
  );

  return server;
}
