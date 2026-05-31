# Protocol compatibility

The template uses version 2 of the official TypeScript SDK. `serveStdio` negotiates the current protocol and retains compatibility with 2025-era clients. Streamable HTTP is served through the SDK's web-standard handler.

Protocol compatibility is verified through client-level integration tests rather than direct calls into handlers.
