import { describe, expect, it } from "vitest";
import { createLogger } from "../src/logger.js";

describe("createLogger", () => {
  it("uses the configured level", () => {
    const logger = createLogger({ transport: "stdio", logLevel: "warn" });
    expect(logger.level).toBe("warn");
  });
});
