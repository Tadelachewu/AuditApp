
import { fetchReports } from "@/lib/queries";
import ReportsClientPage from "./reports-client-page";

export default async function ReportsPage() {
  const reports = await fetchReports();
  return <ReportsClientPage reports={reports || []} />;
}
