# Customization checklist

- Rename the npm package, binary, and MCP server identity.
- Replace the example capabilities in `src/server.ts`.
- Document every environment variable in `.env.example`.
- Add authorization before exposing sensitive remote tools.
- Add project-specific secrets to log redaction.
- Extend readiness checks for external dependencies.
- Replace the repository banner and social preview if the project has its own identity.
- Run `npm run verify` before the first release.
