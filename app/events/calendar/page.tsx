import { getEvents } from "@/domains/events/api/getEvents";
import CalendarPage from "@/domains/events/features/calendar/components/CalendarPage";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  try {
    const events = await getEvents();
    const month = 12;
    const year = 1;

    const shownTimePeriod = year * month;
    const lifeLength = 70; // years

    const periods = lifeLength * shownTimePeriod;
    const rateInDays = 7;

    return (
      <CalendarPage periods={periods} events={events} rateInDays={rateInDays} />
    );
  } catch (e) {
    console.log("Error fetch events data:", e);
    return <div>Error</div>;
  }
}
