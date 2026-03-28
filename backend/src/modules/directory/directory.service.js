import Profile from "../profiles/profile.model.js";
import User from "../auth/user.model.js";
import { toDirectoryCard } from "../../utils/profile.mapper.js";

export const getDirectory = async (query = {}) => {
  const filter = { showInDirectory: true, role: "alumni" };
  if (query.department) filter.department = query.department;

  const profiles = await Profile.find(filter).sort({ fullName: 1 });
  const userIds = profiles.map((p) => p.userId);
  const users = await User.find({ _id: { $in: userIds } }).select(
    "firstName lastName email batchLabel phone role",
  );
  const userById = new Map(users.map((u) => [String(u._id), u]));

  return profiles.map((profile) => {
    const user = userById.get(String(profile.userId));
    return toDirectoryCard(profile, user);
  });
};
