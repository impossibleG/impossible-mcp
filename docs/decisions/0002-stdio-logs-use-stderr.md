# 0002: Write stdio logs to stderr

Status: accepted

The stdio transport owns stdout. Application logs use stderr so they cannot be parsed as protocol frames by the parent MCP host.
