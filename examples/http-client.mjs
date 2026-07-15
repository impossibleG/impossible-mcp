import { Client } from "@modelcontextprotocol/client";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { URL } from "node:url";
import process from "node:process";

const client = new Client({ name: "template-example", version: "1.0.0" });
await client.connect(new StreamableHTTPClientTransport(new URL("http://127.0.0.1:3333/mcp")));
process.stdout.write(`${JSON.stringify(await client.listTools(), null, 2)}\n`);
await client.close();
