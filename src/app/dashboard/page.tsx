import DashboardPage from "@/components/DashboardPage";
import { getUser } from "@/components/Dashboard/api/checkAuth";

export default async function Calendar() {
  const user = await getUser();

  return !user ? <div>Access denied</div> : <DashboardPage />;
}
