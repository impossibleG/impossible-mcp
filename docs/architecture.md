# Architecture

`buildServer` owns protocol capabilities and has no transport assumptions. `startStdio` and `startHttp` adapt the server factory to local and remote clients. Configuration is parsed once at the process boundary.

```text
CLI
 ├─ configuration
 ├─ logger
 └─ transport
     ├─ stdio ─┐
     └─ HTTP ──┴─ server factory ─ tools / resources / prompts
```

This shape keeps business code reusable and makes transport-specific failures easier to isolate.
