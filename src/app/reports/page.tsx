import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";
import { getSession } from "@/lib/session";

export default async function ReportsPage() {
  const session = await getSession();
  const reports = await fetchReports();
  return (
    <DashboardLayout user={session}>
      <ReportsClientPage reports={reports || []} />
    </DashboardLayout>
  );
}
