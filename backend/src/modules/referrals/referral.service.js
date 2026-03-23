import ReferralRequest from "./referral.model.js";

export const getReferrals = async () => ReferralRequest.find().sort({ createdAt: -1 });
export const getReferralById = async (id) => {
  const referral = await ReferralRequest.findById(id);
  if (!referral) {
    const err = new Error("Referral request not found");
    err.statusCode = 404;
    throw err;
  }
  return referral;
};
export const createReferral = async (payload) => ReferralRequest.create(payload);
export const updateReferralById = async (id, payload) => {
  const referral = await ReferralRequest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!referral) {
    const err = new Error("Referral request not found");
    err.statusCode = 404;
    throw err;
  }
  return referral;
};
