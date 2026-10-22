import { z } from "zod";

const booleanFromString = z.preprocess((value) => value === true || value === "true", z.boolean());
const hostnameList = z.string().transform((value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
);
const localhostNames = ["localhost", "127.0.0.1", "[::1]"];

const environmentSchema = z.object({
  MCP_TRANSPORT: z.enum(["stdio", "http"]).default("stdio"),
  MCP_HOST: z.string().min(1).default("127.0.0.1"),
  MCP_PORT: z.coerce.number().int().min(1).max(65_535).default(3333),
  MCP_PATH: z.string().startsWith("/").default("/mcp"),
  MCP_LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  MCP_HTTP_JSON_RESPONSE: booleanFromString.default(false),
  MCP_ALLOWED_HOSTS: hostnameList.default(() => [...localhostNames]),
  MCP_ALLOWED_ORIGINS: hostnameList.default(() => [...localhostNames]),
});

export type AppConfig = {
  transport: "stdio" | "http";
  host: string;
  port: number;
  path: string;
  logLevel: z.infer<typeof environmentSchema>["MCP_LOG_LEVEL"];
  httpJsonResponse: boolean;
  allowedHosts: string[];
  allowedOrigins: string[];
};

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = environmentSchema.safeParse(environment);
  if (!parsed.success) {
    throw new Error(`Invalid configuration: ${z.prettifyError(parsed.error)}`);
  }

  return {
    transport: parsed.data.MCP_TRANSPORT,
    host: parsed.data.MCP_HOST,
    port: parsed.data.MCP_PORT,
    path: parsed.data.MCP_PATH,
    logLevel: parsed.data.MCP_LOG_LEVEL,
    httpJsonResponse: parsed.data.MCP_HTTP_JSON_RESPONSE,
    allowedHosts: parsed.data.MCP_ALLOWED_HOSTS,
    allowedOrigins: parsed.data.MCP_ALLOWED_ORIGINS,
  };
}
