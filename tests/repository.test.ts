import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("repository contract", () => {
  it("documents both supported transports", async () => {
    const readme = await readFile(new URL("../README.md", import.meta.url), "utf8");
    expect(readme).toContain("stdio");
    expect(readme).toContain("Streamable HTTP");
  });
});
