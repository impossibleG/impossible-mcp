# Configuration

| Variable                 | Default     | Description                         |
| ------------------------ | ----------- | ----------------------------------- |
| `MCP_TRANSPORT`          | `stdio`     | `stdio` or `http`                   |
| `MCP_HOST`               | `127.0.0.1` | HTTP bind address                   |
| `MCP_PORT`               | `3333`      | HTTP port                           |
| `MCP_PATH`               | `/mcp`      | Streamable HTTP endpoint            |
| `MCP_LOG_LEVEL`          | `info`      | Pino log level                      |
| `MCP_HTTP_JSON_RESPONSE` | `false`     | Return terminal JSON instead of SSE |

Command-line values override environment values for transport, host, and port.
