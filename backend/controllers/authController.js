import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";

const toAuthResponse = (user) => ({
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  },
  token: generateToken(user._id)
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const email = req.body.email.trim().toLowerCase();

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({ name: name.trim(), email, password });

  res.status(201).json(toAuthResponse(user));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const email = req.body.email.trim().toLowerCase();

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json(toAuthResponse(user));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt
  });
});
