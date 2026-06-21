# Project layout

| Path               | Responsibility                      |
| ------------------ | ----------------------------------- |
| `src/server.ts`    | MCP capability registration         |
| `src/stdio.ts`     | Local transport                     |
| `src/http.ts`      | Remote transport and probes         |
| `src/config.ts`    | Environment parsing                 |
| `src/lifecycle.ts` | Process shutdown                    |
| `tests/`           | Unit and protocol integration tests |
| `examples/`        | Client and extension examples       |
