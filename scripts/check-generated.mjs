import { access } from "node:fs/promises";
import process from "node:process";

await Promise.all([access("dist/cli.js"), access("dist/index.js"), access("dist/index.d.ts")]);
process.stdout.write("compiled package is complete\n");
