import { describe, expect, it, vi } from "vitest";
import { errorHandler, notFound } from "../middleware/errorMiddleware.js";

const createResponse = (statusCode = 200) => {
  const res = {
    statusCode,
    status: vi.fn((code) => {
      res.statusCode = code;
      return res;
    }),
    json: vi.fn(() => res)
  };
  return res;
};

describe("error middleware", () => {
  it("creates a 404 error for unknown routes", () => {
    const req = { originalUrl: "/missing" };
    const res = createResponse();
    const next = vi.fn();

    notFound(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ message: "Not found - /missing" }));
  });

  it("returns a clear duplicate email message", () => {
    const err = {
      code: 11000,
      keyPattern: { email: 1 }
    };
    const res = createResponse();

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "Email is already registered" });
  });

  it("returns the duplicate field name for non-email indexes", () => {
    const err = {
      code: 11000,
      keyPattern: { username: 1 }
    };
    const res = createResponse();

    errorHandler(err, {}, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: "username already exists" });
  });
});
