# Deployment

The included container runs the HTTP transport as an unprivileged user. It exposes port 3333 and reports health through `/healthz`.

Public deployments need an authentication and authorization policy suited to their tools. Put TLS at the edge, limit accepted origins and hosts, rate-limit expensive handlers, and keep the default loopback binding during local development.

Build and run:

```bash
docker compose up --build
```
