import { expect, test } from "vitest";
import { Event } from "@/domains/events/types/Event";
import { isEventBelongsToPeriod } from "./events";
const getMockEvent = (startAt: string, endAt: string): Event => ({
  id: "1",
  name: "test",
  description: "",
  type: "",
  tags: ["test"],
  start_at: startAt,
  end_at: endAt,
});

const may07 = "2023-05-07";
const may08 = "2023-05-08";
const may09 = "2023-05-09";
const may10 = "2023-05-10";
const may11 = "2023-05-11";
const may12 = "2023-05-12";
const may13 = "2023-05-13";

test.each([
  [getMockEvent(may10, may10), may09, may11, true],
  [getMockEvent(may09, may10), may09, may11, true],
  [getMockEvent(may10, may11), may09, may11, true],
  [getMockEvent(may09, may11), may09, may11, true],
  [getMockEvent(may09, may12), may09, may11, true],
  [getMockEvent(may08, may12), may09, may11, true],
  [getMockEvent(may11, may12), may09, may11, true],
  [getMockEvent(may08, may09), may09, may11, true],
  [getMockEvent(may08, may08), may09, may11, false],
  [getMockEvent(may07, may08), may09, may11, false],
  [getMockEvent(may12, may12), may09, may11, false],
  [getMockEvent(may12, may13), may09, may11, false],
])("%# is event belong to period", (event, startAt, endAt, expected) => {
  expect(
    isEventBelongsToPeriod(event, new Date(startAt), new Date(endAt))
  ).toBe(expected);
});
