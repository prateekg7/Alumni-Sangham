import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as collegeService from "./college.service.js";

export const verifyRoll = asyncHandler(async (req, res) => {
  const data = await collegeService.verifyRollNumber(req.params.rollNumber);
  res.status(200).json(new ApiResponse(200, data, "Lookup complete"));
});

export const listRecords = asyncHandler(async (req, res) => {
  const data = await collegeService.listCollegeRecords(req.query);
  res.status(200).json(new ApiResponse(200, data, "College records fetched"));
});

export const createRecord = asyncHandler(async (req, res) => {
  const data = await collegeService.createCollegeRecord(req.body);
  res.status(201).json(new ApiResponse(201, data, "College record created"));
});

export const deleteRecord = asyncHandler(async (req, res) => {
  const data = await collegeService.deleteCollegeRecord(req.params.id);
  res.status(200).json(new ApiResponse(200, data, "College record deleted"));
});
