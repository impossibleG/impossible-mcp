# Operations

Health confirms the process can answer HTTP requests. Readiness indicates that the process is ready to receive MCP traffic. Extend readiness checks when your server depends on databases, model runtimes, or other services.

Structured logs redact common credential fields. Add project-specific secret names before deployment. stdio mode always writes application logs to stderr because stdout is reserved for protocol messages.

SIGINT and SIGTERM initiate graceful HTTP shutdown.
