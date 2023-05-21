import Page from "@/app/domains/Dashboard/components/page";
import { getUser } from "@/app/domains/Dashboard/api/checkAuth";

export default async function Calendar() {
  const user = await getUser();

  return !user ? <div>Access denied</div> : <Page />;
}
