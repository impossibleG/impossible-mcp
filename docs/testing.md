# Testing

The test suite covers configuration, HTTP probes, lifecycle handlers, logging, and errors. Capability integration tests should call the server through an MCP client rather than calling tool handlers directly; this verifies protocol serialization and validation as well as business behavior.

Run the complete gate with:

```bash
npm run verify
```
