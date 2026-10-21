# Configuration

| Variable                 | Default                     | Description                                       |
| ------------------------ | --------------------------- | ------------------------------------------------- |
| `MCP_TRANSPORT`          | `stdio`                     | `stdio` or `http`                                 |
| `MCP_HOST`               | `127.0.0.1`                 | HTTP bind address                                 |
| `MCP_PORT`               | `3333`                      | HTTP port                                         |
| `MCP_PATH`               | `/mcp`                      | Streamable HTTP endpoint                          |
| `MCP_LOG_LEVEL`          | `info`                      | Pino log level                                    |
| `MCP_HTTP_JSON_RESPONSE` | `false`                     | Return terminal JSON instead of SSE               |
| `MCP_ALLOWED_HOSTS`      | `localhost,127.0.0.1,[::1]` | Comma-separated `Host` names the endpoint accepts |
| `MCP_ALLOWED_ORIGINS`    | `localhost,127.0.0.1,[::1]` | Comma-separated browser `Origin` hostnames        |

Command-line values override environment values for transport, host, and port.

The MCP endpoint answers `403` when the `Host` header or a browser's `Origin` header names a hostname outside these lists. This blocks DNS rebinding attacks against servers on a developer's machine. Entries are hostnames without scheme or port; write IPv6 addresses in brackets. Requests without an `Origin` header, which is how non-browser MCP clients connect, are not affected by the origin list. When the server is reached through a public name, add that name to `MCP_ALLOWED_HOSTS`, and to `MCP_ALLOWED_ORIGINS` if browsers call it. Health and readiness routes are not restricted.
