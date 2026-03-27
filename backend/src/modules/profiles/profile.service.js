import Profile from "./profile.model.js";

export const getProfiles = async () => Profile.find();

export const getProfileById = async (id) => {
  const profile = await Profile.findById(id);
  if (!profile) {
    const err = new Error("Profile not found");
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

export const createProfile = async (payload) => Profile.create(payload);

export const updateProfileById = async (id, payload) => {
  const profile = await Profile.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!profile) {
    const err = new Error("Profile not found");
    err.statusCode = 404;
    throw err;
  }
  return profile;
};

export const deleteProfileById = async (id) => {
  const deleted = await Profile.findByIdAndDelete(id);
  if (!deleted) {
    const err = new Error("Profile not found");
    err.statusCode = 404;
    throw err;
  }
  return { id };
};
