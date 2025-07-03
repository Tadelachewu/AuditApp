import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function ReportsPage() {
  const user = await getSession();
  const reports = await fetchReports();
  return (
    <DashboardLayout user={user}>
      <ReportsClientPage reports={reports || []} />
    </DashboardLayout>
  );
}
