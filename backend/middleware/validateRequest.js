import { TASK_STAGES } from "../models/Task.js";

const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

const fail = (res, message) => res.status(400).json({ message });

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return fail(res, "Name, email, and password are required");
  }

  if (!isValidEmail(email)) {
    return fail(res, "Please provide a valid email");
  }

  if (password.length < 6) {
    return fail(res, "Password must be at least 6 characters");
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return fail(res, "Email and password are required");
  }

  next();
};

export const validateTask = (req, res, next) => {
  const { title, description, stage } = req.body;

  if (!title?.trim() || !description?.trim()) {
    return fail(res, "Title and description are required");
  }

  if (stage && !TASK_STAGES.includes(stage)) {
    return fail(res, "Invalid task stage");
  }

  next();
};

export const validateStage = (req, res, next) => {
  if (!TASK_STAGES.includes(req.body.stage)) {
    return fail(res, "Invalid task stage");
  }

  next();
};
