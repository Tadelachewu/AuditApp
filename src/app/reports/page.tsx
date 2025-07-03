import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";
import { DashboardLayout } from "@/components/dashboard-layout";

export default async function ReportsPage() {
  const reports = await fetchReports();
  return (
    <DashboardLayout>
      <ReportsClientPage reports={reports || []} />
    </DashboardLayout>
  );
}
