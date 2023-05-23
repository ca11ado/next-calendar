import { eventsCalendar } from "@/app/utils/server/routes";
import { redirect } from "next/navigation";

export default async function Events() {
  return redirect(eventsCalendar);
}
