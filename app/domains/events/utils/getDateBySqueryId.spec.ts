import { expect, test } from "vitest";
import { getDateBySqueryId } from "./getDateBySqueryId";

test.each([
  [1, "2023-05-17", 7, { startDate: "2023-05-17", endDate: "2023-05-24" }],
  [2, "2023-05-17", 7, { startDate: "2023-05-25", endDate: "2023-06-01" }],
  [3, "2023-05-17", 7, { startDate: "2023-06-02", endDate: "2023-06-09" }],
  [4, "2023-05-17", 7, { startDate: "2023-06-10", endDate: "2023-06-17" }],
  [5, "2023-05-17", 7, { startDate: "2023-06-18", endDate: "2023-06-25" }],
  [6, "2023-05-17", 7, { startDate: "2023-06-26", endDate: "2023-07-03" }],
  [7, "2023-05-17", 7, { startDate: "2023-07-04", endDate: "2023-07-11" }],
  [8, "2023-05-17", 7, { startDate: "2023-07-12", endDate: "2023-07-19" }],
  [9, "2023-05-17", 7, { startDate: "2023-07-20", endDate: "2023-07-27" }],
  [10, "2023-05-17", 7, { startDate: "2023-07-28", endDate: "2023-08-04" }],
  [11, "2023-05-17", 7, { startDate: "2023-08-05", endDate: "2023-08-12" }],
])("add(%i, %i) -> %i", (a, b, c, expected) => {
  expect(getDateBySqueryId(a, new Date(b), c)).toEqual({
    startDate: new Date(expected.startDate),
    endDate: new Date(expected.endDate),
  });
});
