import jwt from "jsonwebtoken";
import { afterEach, describe, expect, it } from "vitest";
import { generateToken } from "../utils/generateToken.js";

describe("generateToken", () => {
  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  it("signs a JWT containing the user id", () => {
    process.env.JWT_SECRET = "test-secret";

    const token = generateToken("user-123");
    const decoded = jwt.verify(token, "test-secret");

    expect(decoded).toMatchObject({ id: "user-123" });
  });

  it("throws when JWT_SECRET is missing", () => {
    expect(() => generateToken("user-123")).toThrow("JWT_SECRET is not configured");
  });
});
