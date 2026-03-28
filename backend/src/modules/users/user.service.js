import User from "../auth/user.model.js";
import ApiError from "../../utils/ApiError.js";

export const getUsers = async () => User.find().select("-passwordHash -refreshTokens");

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-passwordHash -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const updateUserById = async (id, payload, allowPrivilegedFields = false) => {
  const disallowed = ["passwordHash", "refreshTokens"];
  const safe = { ...payload };
  for (const key of disallowed) {
    delete safe[key];
  }
  if (!allowPrivilegedFields) {
    delete safe.role;
    delete safe.email;
  }

  const user = await User.findByIdAndUpdate(id, safe, {
    new: true,
    runValidators: true,
  }).select("-passwordHash -refreshTokens");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

export const deleteUserById = async (id) => {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, "User not found");
  }
  return { id };
};
