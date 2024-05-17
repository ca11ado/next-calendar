import { addDays } from "date-fns";

export const getDateBySqueryId = (
  id: number,
  startDate: Date,
  daysRatio: number = 7
) => {
  if (id <= 0) {
    throw new Error("Id is not valid");
  }
  const add = (id - 1) * (daysRatio + 1);
  const start = id === 1 ? startDate : addDays(startDate, add);
  return {
    startDate: start,
    endDate: addDays(start, daysRatio),
  };
};
