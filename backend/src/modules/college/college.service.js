import CollegeRecord from "../directory/collegeRecord.model.js";
import ApiError from "../../utils/ApiError.js";

export const listCollegeRecords = async (query = {}) => {
  const filter = {};
  if (query.department) filter.department = query.department;
  if (query.recordType) filter.recordType = query.recordType;
  return CollegeRecord.find(filter).sort({ batchYear: -1, name: 1 });
};

export const createCollegeRecord = async (payload) => CollegeRecord.create(payload);

export const deleteCollegeRecord = async (id) => {
  const deleted = await CollegeRecord.findByIdAndDelete(id);
  if (!deleted) {
    throw new ApiError(404, "College record not found");
  }
  return { id };
};

/** Public lookup for registration / verification flows */
export const verifyRollNumber = async (rollNumber) => {
  if (!rollNumber?.trim()) {
    throw new ApiError(400, "rollNumber is required");
  }
  const record = await CollegeRecord.findOne({ rollNumber: rollNumber.trim() });
  if (!record) {
    return { verified: false };
  }
  return {
    verified: true,
    name: record.name,
    department: record.department,
    batchYear: record.batchYear,
    recordType: record.recordType,
  };
};
