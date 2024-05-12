import { expect, test } from "vitest";
import { getDateBySqueryId } from "./getDateBySqueryId";

test.each([
  [1, 1, 7, { startDate: 1, endDate: 1 }],
  [1, 1, 7, { startDate: 1, endDate: 1 }],
])("#% check generated function", (a, b, c, expected) => {
  expect(getDateBySqueryId(a, new Date(b), c)).toBe(expected);
});

test.each([
  [1, 1, 7, { startDate: 1, endDate: 1 }],
  [1, 1, 7, { startDate: 1, endDate: 1 }],
])("add(%i, %i) -> %i", (a, b, c, expected) => {
  expect(a + b).toBe(expected);
});

// this will return
// ✓ add(1, 1) -> 2
// ✓ add(1, 2) -> 3
// ✓ add(2, 1) -> 3
