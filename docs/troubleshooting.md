# Troubleshooting

## A stdio client cannot connect

Build first, use an absolute path to `dist/cli.js`, and confirm application logs are written to stderr. Any non-protocol text written to stdout can break the connection.

## HTTP returns 404

The MCP endpoint defaults to `/mcp`. Health routes use `/healthz` and `/readyz`.

## A tool is missing

Confirm it is registered inside `buildServer` and restart clients that cache capability listings.
