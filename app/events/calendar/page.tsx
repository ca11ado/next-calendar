import { getEvents } from "@/domains/events/api/getEvents";
import CalendarPage from "@/domains/events/features/calendar/components/CalendarPage";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  try {
    const events = await getEvents();
    const month = 12;
    const week = 4;
    const lifeLengthInYears = 70;
    const scale = lifeLengthInYears * month * week;

    return <CalendarPage periods={scale} events={events} />;
  } catch (e) {
    console.log("Error fetch events data:", e);
    return <div>Error</div>;
  }
}
