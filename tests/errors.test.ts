import { describe, expect, it } from "vitest";
import { AppError, toError } from "../src/errors.js";

describe("errors", () => {
  it("retains operational metadata", () => {
    const error = new AppError("missing", { code: "NOT_FOUND", status: 404 });
    expect(error).toMatchObject({ message: "missing", code: "NOT_FOUND", status: 404 });
  });

  it("normalizes non-error throws", () => {
    expect(toError("failure").message).toBe("failure");
  });
});
