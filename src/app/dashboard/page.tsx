import Page from "@/app/domains/dashboard/components/page";
import { getUser } from "@/app/domains/dashboard/api/checkAuth";

export const dynamic = "force-dynamic";

export default async function Calendar() {
  const user = await getUser();

  return !user ? <div>Access denied</div> : <Page />;
}
