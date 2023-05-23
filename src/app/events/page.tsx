import { eventsCalendar } from "@/utils/server/routes";
import { redirect } from "next/navigation";

export default async function Events() {
  return redirect(eventsCalendar);
}
