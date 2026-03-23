import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import * as hofService from "./hof.service.js";

export const getHallOfFame = asyncHandler(async (req, res) => {
  const data = await hofService.getHallOfFame();
  res.status(200).json(apiResponse({ message: "Hall of fame fetched", data }));
});

export const createHallOfFameEntry = asyncHandler(async (req, res) => {
  const data = await hofService.createHallOfFameEntry(req.body);
  res.status(201).json(apiResponse({ message: "Hall of fame entry created", data }));
});
