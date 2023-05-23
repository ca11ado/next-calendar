import { get } from "@vercel/edge-config";
import CalendarPage from "@/domains/events/features/calendar/components/CalendarPage";
import Card from "@/domains/events/features/calendar/components/Card";
import { Event } from "@/domains/events/types/Event";
import Events from "@/domains/events/features/calendar/components/Events";
import groupBy from "lodash/groupBy";
import { EVENTS_KEY } from "@/config";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const events = await get<Array<Event>>(EVENTS_KEY);
    return events || [];
  } catch (error) {
    throw error;
  }
}

export default async function Calendar() {
  let events: Array<Event> = [];
  try {
    events = await getEvents();
  } catch (e) {
    console.log("error fetch days data", e);
  }
  const groupedEvents = groupBy(events, (event) => new Date(event.date));
  console.log(groupedEvents);
  return (
    <CalendarPage>
      {Object.keys(groupedEvents).map((date) => (
        <Card key={date}>
          <Events events={groupedEvents[date]} />
        </Card>
      ))}
    </CalendarPage>
  );
}
