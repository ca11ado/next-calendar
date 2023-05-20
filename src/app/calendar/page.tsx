import CalendarPage from "@/components/CalendarPage";
import Card from "@/components/Card";
import { Event } from "@/types/Event";
import Events from "@/components/Events";
import groupBy from 'lodash/groupBy';

async function getData() {
  const url = `${process.env.BASE_URL}/api/days`;
  const res = await fetch(url);
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data: ${url}`);
  }

  return res.json();
}


export default async function Calendar() {
  let events: Array<Event> = [];
  try {
    events = await getData();
  } catch (e) {
    console.log('could not receive logs', e)
  }
  const groupedEvents = groupBy(events, event => event.date)
  return <CalendarPage>
    {Object.keys(groupedEvents).map((date) => (
      <Card key={date}>
        <Events events={groupedEvents[date]} />
      </Card>
    ))}
  </CalendarPage>
}
