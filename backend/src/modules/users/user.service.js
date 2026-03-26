import User from "../auth/user.model.js";

export const getUsers = async () => User.find().select("-passwordHash");

export const getUserById = async (id) => {
  const user = await User.findById(id).select("-passwordHash");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

export const updateUserById = async (id, payload) => {
  const user = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).select("-passwordHash");
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return user;
};

export const deleteUserById = async (id) => {
  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }
  return { id };
};
