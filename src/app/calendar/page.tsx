import CalendarPage from "@/components/CalendarPage";
import Card from "@/components/Card";
import { Event } from "@/types/Event";
import Events from "@/components/Events";
import groupBy from "lodash/groupBy";

async function getData() {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/days`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch data: ${url}`);
  }

  return res.json();
}

export default async function Calendar() {
  let events: Array<Event> = [];
  try {
    events = await getData();
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
