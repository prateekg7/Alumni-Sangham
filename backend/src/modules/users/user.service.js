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

const SELF_UPDATE_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "department",
  "expectedGradYear",
  "gradYear",
  "currentCompany",
];

const PRIVILEGED_UPDATE_FIELDS = [
  ...SELF_UPDATE_FIELDS,
  "email",
  "role",
  "batchLabel",
  "isVerified",
  "verificationStatus",
  "verificationDocUrl",
  "isActive",
];

function pickAllowedFields(payload = {}, allowedFields = []) {
  const update = {};
  for (const key of allowedFields) {
    if (payload[key] !== undefined) {
      update[key] = typeof payload[key] === "string" ? payload[key].trim() : payload[key];
    }
  }
  return update;
}

export const updateUserById = async (id, payload, allowPrivilegedFields = false) => {
  const allowedFields = allowPrivilegedFields ? PRIVILEGED_UPDATE_FIELDS : SELF_UPDATE_FIELDS;
  const safe = pickAllowedFields(payload, allowedFields);

  if (!Object.keys(safe).length) {
    throw new ApiError(400, "No allowed fields to update");
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
