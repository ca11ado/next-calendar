import CalendarPage from "@/domains/events/features/calendar/components/CalendarPage";
import Card from "@/domains/events/features/calendar/components/Card";
import { Event } from "@/domains/events/types/Event";
import { getEvents } from "@/domains/events/api/getEvents";
import { createArrayFromNumber } from "@/utils/array";

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

  const periods: { number: number }[] = createArrayFromNumber(
    lifeLength * shownTimePeriod
  ).map((number) => ({ number }));

  return (
    <CalendarPage>
      {periods.map(({ number }) => (
        <Card>{number}</Card>
      ))}
    </CalendarPage>
  );
  return (
    <CalendarPage>
      {events.map(({ id, name, description }) => (
        <Card key={1222}>
          {[id, name, description].filter(Boolean).join(" | ")}
        </Card>
      ))}
    </CalendarPage>
  );
}
