import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiResponse } from "../../utils/ApiResponse.js";
import { getDirectory } from "./directory.service.js";

export const getDirectoryEntries = asyncHandler(async (req, res) => {
  const data = await getDirectory(req.query);
  res.status(200).json(apiResponse({ message: "Directory fetched", data }));
});
