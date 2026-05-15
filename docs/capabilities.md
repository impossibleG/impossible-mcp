# Capabilities

The example server demonstrates the three principal MCP capability families.

## Tools

Tools perform actions. Their input is validated with Zod before the handler runs. Return structured content where clients need machine-readable output and text where the result is primarily conversational.

## Resources

Resources expose readable application context through stable URIs. The greeting example demonstrates URI templates.

## Prompts

Prompts provide reusable message templates. Treat prompt arguments as untrusted input and keep authorization decisions outside model instructions.
