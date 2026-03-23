import HallOfFame from "./hof.model.js";

export const getHallOfFame = async () =>
  HallOfFame.find().sort({ category: 1, displayOrder: 1 });

export const createHallOfFameEntry = async (payload) => HallOfFame.create(payload);
