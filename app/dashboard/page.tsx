import { redirect } from "next/navigation";
import Page from "@/domains/events/features/dashboard/components/Page";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";
import { getEvents } from "@/domains/events/api/getEvents";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getUser();
  try {
    const events = await getEvents();
    return !user ? <div>Access denied</div> : <Page events={events} />;
  } catch (e) {
    console.log("error fetch days data", e);
    return redirect("/500");
  }
}
