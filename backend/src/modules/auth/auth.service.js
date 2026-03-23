import bcrypt from "bcryptjs";
import User from "./auth.model.js";
import { generateToken } from "../../utils/generateToken.js";
import { validateLogin, validateRegister } from "./auth.validation.js";

export const register = async (payload) => {
  validateRegister(payload);

  const existing = await User.findOne({ email: payload.email });
  if (existing) {
    const err = new Error("User already exists");
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);
  const user = await User.create({
    email: payload.email,
    passwordHash,
    role: payload.role,
  });

  const token = generateToken({ id: user._id, role: user.role, email: user.email });
  return { user, token };
};

export const login = async (payload) => {
  validateLogin(payload);

  const user = await User.findOne({ email: payload.email });
  if (!user?.passwordHash) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
  if (!isValidPassword) {
    const err = new Error("Invalid credentials");
    err.statusCode = 401;
    throw err;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = generateToken({ id: user._id, role: user.role, email: user.email });
  return { user, token };
};
