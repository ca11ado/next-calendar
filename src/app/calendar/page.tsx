import { get } from "@vercel/edge-config";
import CalendarPage from "@/components/CalendarPage";
import Card from "@/components/Card";
import { Event } from "@/types/Event";
import Events from "@/components/Events";
import groupBy from "lodash/groupBy";
import { EVENTS_KEY } from "@/config";

export const dynamic = "force-dynamic";

async function getEvents() {
  try {
    const events = await get<Array<Event>>(EVENTS_KEY);
    return events || [];
  } catch (error) {
    console.error("Failed to get value from Edge Config:", error);
    return [];
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
