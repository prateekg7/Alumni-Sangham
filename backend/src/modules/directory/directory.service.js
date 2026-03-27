import Profile from "../profiles/profile.model.js";

export const getDirectory = async (query = {}) => {
  const filter = { showInDirectory: true };
  if (query.department) filter.department = query.department;
  if (query.role) filter.role = query.role;

  return Profile.find(filter).select("-location -__v").sort({ fullName: 1 });
};
