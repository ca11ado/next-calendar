import Page from "@/domains/events/features/dashboard/page";
import { getUser } from "@/domains/events/features/dashboard/api/checkAuth";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  const user = await getUser();

  return !user ? <div>Access denied</div> : <Page />;
}
