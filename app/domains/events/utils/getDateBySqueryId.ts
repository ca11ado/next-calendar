import { addDays } from "date-fns";

// TODO: add tests with vite
export const getDateBySqueryId = (
  id: number,
  startDate: Date,
  daysRatio: number = 7
) => {
  return {
    startDate: id === 1 ? startDate : addDays(startDate, id),
    endDate: addDays(startDate, id * daysRatio),
  };
};
