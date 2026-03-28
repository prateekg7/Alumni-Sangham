import HallOfFame from "./hof.model.js";
import ApiError from "../../utils/ApiError.js";

export const getHallOfFame = async () =>
  HallOfFame.find().sort({ category: 1, displayOrder: 1 });

export const createHallOfFameEntry = async (payload) => {
  try {
    return await HallOfFame.create(payload);
  } catch (err) {
    if (err.name === "ValidationError") {
      throw new ApiError(400, err.message);
    }
    throw err;
  }
};
