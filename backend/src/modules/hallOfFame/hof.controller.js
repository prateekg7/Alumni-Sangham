import { asyncHandler } from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import * as hofService from "./hof.service.js";

export const getHallOfFame = asyncHandler(async (req, res) => {
  const data = await hofService.getHallOfFame();
  res.status(200).json(new ApiResponse(200, data, "Hall of fame fetched"));
});

export const createHallOfFameEntry = asyncHandler(async (req, res) => {
  const data = await hofService.createHallOfFameEntry(req.body);
  res.status(201).json(new ApiResponse(201, data, "Hall of fame entry created"));
});
