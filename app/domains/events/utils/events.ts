import { Event } from "@/domains/events/types/Event";

export const isCurrentEvent = (
  event: Event | null,
  currentEvent: Event | null
) =>
  event &&
  currentEvent &&
  event.type === currentEvent.type &&
  event.start_at === currentEvent.start_at &&
  event.end_at === currentEvent.end_at;

export const getFirstEvent = (events: Event[]) => {
  if (events.length === 0) {
    throw new Error("Events array is empty");
  }

  let eventWithEarliestDate = events[0];
  for (let i = 1; i < events.length; i++) {
    if (
      new Date(events[i].start_at) < new Date(eventWithEarliestDate.start_at)
    ) {
      eventWithEarliestDate = events[i];
    }
  }

  return eventWithEarliestDate;
};

export const isEventBelongsToPeriod = (
  event: Event,
  startDate: Date,
  endDate: Date
) => {
  const eventStartDate = new Date(event.start_at);
  const eventEndDate = new Date(event.end_at);
  const periodStartDate = new Date(startDate);
  const periodEndDate = new Date(endDate);
  if (eventStartDate > periodEndDate) return false;
  if (eventEndDate < periodStartDate) return false;
  return true;
};
