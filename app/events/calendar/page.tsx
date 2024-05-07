import { Event } from "@/domains/events/types/Event";
import { getEvents } from "@/domains/events/api/getEvents";
import CalendarPage from "@/domains/events/features/calendar/components/CalendarPage";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  let events: Array<Event> = [];
  try {
    events = await getEvents();
  } catch (e) {
    console.log("Error fetch events data:", e);
  }

  const month = 12;
  const year = 1;

  const shownTimePeriod = year * month;
  const lifeLength = 70; // years

  const periods = lifeLength * shownTimePeriod;

  return <CalendarPage periods={periods} />;
}
