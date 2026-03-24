import { asyncHandler } from "../../utils/asyncHandler.js";
import  ApiResponse  from "../../utils/ApiResponse.js";
import { getDirectory } from "./directory.service.js";

export const getDirectoryEntries = asyncHandler(async (req, res) => {
  const data = await getDirectory(req.query);
  res.status(200).json(ApiResponse({ message: "Directory fetched", data }));
});
