import { describe, expect, it, vi } from "vitest";
import {
  validateLogin,
  validateRegister,
  validateStage,
  validateTask
} from "../middleware/validateRequest.js";

const createResponse = () => {
  const res = {
    status: vi.fn(() => res),
    json: vi.fn(() => res)
  };
  return res;
};

describe("request validation middleware", () => {
  it("accepts a valid registration payload", () => {
    const req = {
      body: {
        name: "Tarak",
        email: "tarak@example.com",
        password: "123456"
      }
    };
    const res = createResponse();
    const next = vi.fn();

    validateRegister(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("rejects registration with an invalid email", () => {
    const req = {
      body: {
        name: "Tarak",
        email: "not-an-email",
        password: "123456"
      }
    };
    const res = createResponse();

    validateRegister(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Please provide a valid email" });
  });

  it("rejects login when password is missing", () => {
    const req = { body: { email: "tarak@example.com" } };
    const res = createResponse();

    validateLogin(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Email and password are required" });
  });

  it("accepts a complete task payload", () => {
    const req = {
      body: {
        title: "Write README",
        description: "Document installation and deployment.",
        stage: "In Progress"
      }
    };
    const res = createResponse();
    const next = vi.fn();

    validateTask(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("rejects invalid task stages", () => {
    const req = {
      body: {
        title: "Ship app",
        description: "Finish assignment.",
        stage: "Blocked"
      }
    };
    const res = createResponse();

    validateTask(req, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid task stage" });
  });

  it("validates stage movement requests", () => {
    const res = createResponse();
    const next = vi.fn();

    validateStage({ body: { stage: "Done" } }, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
