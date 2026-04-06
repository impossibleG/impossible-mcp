import { afterEach, describe, expect, it, vi } from "vitest";
import { installShutdownHandlers } from "../src/lifecycle.js";

describe("installShutdownHandlers", () => {
  afterEach(() => vi.restoreAllMocks());

  it("registers and removes signal listeners", () => {
    const on = vi.spyOn(process, "on");
    const off = vi.spyOn(process, "off");
    const dispose = installShutdownHandlers(() => Promise.resolve(), {
      info: vi.fn(),
      error: vi.fn(),
    } as never);
    expect(on).toHaveBeenCalledWith("SIGINT", expect.any(Function));
    expect(on).toHaveBeenCalledWith("SIGTERM", expect.any(Function));
    dispose();
    expect(off).toHaveBeenCalledTimes(2);
  });
});
