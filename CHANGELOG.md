# Changelog

This project follows Semantic Versioning. Release notes describe protocol support, operational changes, and any migration work required by template users.

## Unreleased

- Initial TypeScript MCP server template.
- HTTP: a request with a malformed `Host` header or request target no longer crashes the process.
- HTTP: the MCP endpoint validates `Host` and `Origin` headers against `MCP_ALLOWED_HOSTS` and `MCP_ALLOWED_ORIGINS` (localhost by default) to block DNS rebinding.
